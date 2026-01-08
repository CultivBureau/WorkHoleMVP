"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Upload, File, Loader2, AlertCircle, CheckCircle, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { useGetAllLeaveTypesQuery } from "../../services/apis/LeaveTypeApi"
import { useSubmitLeaveRequestMutation, useGetMyLeaveRequestsQuery } from "../../services/apis/LeaveApi"
import { useGetEmployeeLeaveSummaryQuery } from "../../services/apis/DashboardApi"
import { useMeQuery } from "../../services/apis/AuthApi"
import { useGetShiftByIdQuery } from "../../services/apis/ShiftApi"
import { enumValuesToDayNames } from "../../utils/workDayUtils"

const LeaveRequest = ({ refetch }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === "ar"

  // Get current user data from /me endpoint
  const { data: meData } = useMeQuery()
  const userData = meData?.value || null
  
  // Get shift ID from user data
  const shiftId = userData?.shift?.id || userData?.shiftId || null
  
  // Always fetch shift details using getShiftById to get workdays
  const { data: shiftData, isLoading: isLoadingShift } = useGetShiftByIdQuery(shiftId, {
    skip: !shiftId
  })
  
  // Get user's shift workdays - prioritize shiftData from API, then userData as fallback
  const userWorkDays = useMemo(() => {
    // Handle shiftData response structure (could be shiftData.value or shiftData directly)
    const shift = shiftData?.value || shiftData
    
    // First try to get workdays from fetched shiftData (most reliable)
    if (shift?.workDays && Array.isArray(shift.workDays) && shift.workDays.length > 0) {
      // workDays is an array of WorkDay enum values (1-7)
      return enumValuesToDayNames(shift.workDays)
    }
    
    // Fallback: try to get workdays from userData.shift
    if (userData?.shift?.workDays && Array.isArray(userData.shift.workDays) && userData.shift.workDays.length > 0) {
      return enumValuesToDayNames(userData.shift.workDays)
    }
    
    // If still not available, return empty array (will not count any days)
    return []
  }, [shiftData, userData?.shift?.workDays])

  // Get available leaves from summary
  const { data: leaveSummary } = useGetEmployeeLeaveSummaryQuery()
  const availableLeaves = leaveSummary?.availableLeavesDays ?? 0

  const { data: myLeaveRequestsData } = useGetMyLeaveRequestsQuery()

  const existingLeaves = useMemo(() => {
    const list = myLeaveRequestsData?.value
    if (!Array.isArray(list)) return []

    return list
      .map((leave) => {
        const start = leave?.startDate || leave?.fromDate
        const end = leave?.endDate || leave?.toDate || start
        const status = (leave?.status || leave?.leaveStatus || leave?.requestStatus || "").toString().toLowerCase()
        return { start, end, status }
      })
      .filter(
        (leave) =>
          leave.start &&
          leave.end &&
          !["rejected", "cancelled", "canceled"].includes(leave.status)
      )
  }, [myLeaveRequestsData])

  const hasOverlappingLeave = useCallback(
    (from, to) => {
      if (!from || !to || !existingLeaves.length) return false
      const newStart = new Date(from)
      const newEnd = new Date(to)
      if (Number.isNaN(newStart.getTime()) || Number.isNaN(newEnd.getTime())) return false

      return existingLeaves.some(({ start, end }) => {
        const leaveStart = new Date(start)
        const leaveEnd = new Date(end)
        if (Number.isNaN(leaveStart.getTime()) || Number.isNaN(leaveEnd.getTime())) return false
        return newStart <= leaveEnd && newEnd >= leaveStart
      })
    },
    [existingLeaves]
  )

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    numberOfDays: 0,
    reason: "",
    attachment: null,
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)

  // Fetch leave types from API
  const { data: leaveTypesData, isLoading: isLoadingLeaveTypes, isError: isErrorLeaveTypes } = useGetAllLeaveTypesQuery({ 
    pageNumber: 1, 
    pageSize: 50,
    status: 0 // Active only
  })

  // Submit leave request mutation
  const [submitLeaveRequest, { isLoading: isSubmitting }] = useSubmitLeaveRequestMutation()

  // Map leave types from API to form options
  const leaveTypes = useMemo(() => {
    if (!leaveTypesData?.value) return []
    const items = Array.isArray(leaveTypesData.value) ? leaveTypesData.value : []
    return items.map(type => ({
      value: type.id,
      label: type.name,
    }))
  }, [leaveTypesData])

  const today = new Date().toISOString().split("T")[0]

  // Helper to check if date is a workday based on user's shift workdays
  const isWorkDay = useCallback((date) => {
    // If workdays aren't loaded yet, don't allow selection (return false)
    // This ensures we only allow workdays to be selected
    if (!userWorkDays || userWorkDays.length === 0) {
      return false
    }
    const day = new Date(date).getDay()
    // JavaScript getDay() returns: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[day]
    // Only return true if the day is in the workdays array
    return userWorkDays.includes(dayName)
  }, [userWorkDays])

  // Helper to count only workdays (excluding weekends/days off based on WorkDay enum)
  const calculateDays = useCallback((from, to) => {
    if (from && to) {
      // Must have workdays loaded to calculate - return 0 if not loaded
      if (!userWorkDays || userWorkDays.length === 0) {
        return 0
      }
      
      let fromDate = new Date(from)
      let toDate = new Date(to)
      if (toDate < fromDate) return 0
      
      // Only count workdays - any day not in workdays array is NOT counted
      let count = 0
      const currentDate = new Date(fromDate)
      
      while (currentDate <= toDate) {
        // Only increment count if the day is a workday
        if (isWorkDay(currentDate)) {
          count++
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return count
    }
    return 0
  }, [userWorkDays, isWorkDay])

  const handleDateChange = (field, value) => {
    const selectedDate = new Date(value)
    
    // Clear previous errors for this field
    setErrors(prev => ({ ...prev, [field]: null, numberOfDays: null }))

    // Check if workdays are loaded
    if (!userWorkDays || userWorkDays.length === 0) {
      if (isLoadingShift) {
        toast.error(
          isArabic
            ? "جارٍ تحميل بيانات أيام العمل. يرجى الانتظار..."
            : "Loading workdays data. Please wait..."
        )
      } else {
        toast.error(
          isArabic
            ? "لا توجد أيام عمل محددة. يرجى الاتصال بالدعم."
            : "No workdays configured. Please contact support."
        )
      }
      return
    }
    
    // Check if it's a workday
    if (!isWorkDay(selectedDate)) {
      const day = selectedDate.getDay()
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const dayName = dayNames[day]
      const dayLabels = {
        sunday: isArabic ? "الأحد" : "Sunday",
        monday: isArabic ? "الاثنين" : "Monday",
        tuesday: isArabic ? "الثلاثاء" : "Tuesday",
        wednesday: isArabic ? "الأربعاء" : "Wednesday",
        thursday: isArabic ? "الخميس" : "Thursday",
        friday: isArabic ? "الجمعة" : "Friday",
        saturday: isArabic ? "السبت" : "Saturday"
      }

      toast.error(
        isArabic
          ? `${dayLabels[dayName]} ليس يوم عمل. لا يمكنك اختياره.`
          : `${dayLabels[dayName]} is not a workday. You cannot select it.`
      )
      return
    }

    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      if (field === "fromDate" || field === "toDate") {
        const calculatedDays = calculateDays(
          field === "fromDate" ? value : prev.fromDate,
          field === "toDate" ? value : prev.toDate,
        )
        newData.numberOfDays = calculatedDays
        
        // Show info message if workdays aren't loaded yet (but allow selection)
        if (!userWorkDays || userWorkDays.length === 0) {
          // Don't show error, just allow selection - workdays will be applied when loaded
          // The count will be recalculated once workdays are available
        }
        
        // Validate available leaves
        if (calculatedDays > 0 && calculatedDays > availableLeaves) {
          setErrors(prevErrors => ({
            ...prevErrors,
            numberOfDays: isArabic
              ? `لا توجد إجازات متاحة كافية. المتاح: ${availableLeaves} يوم`
              : `Insufficient available leaves. Available: ${availableLeaves} days`
          }))
        }
      }
      return newData
    })
  }

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.leaveTypeId) {
      newErrors.leaveTypeId = t("leaves.validation.leaveTypeRequired", "Please select a leave type")
    }

    if (!formData.fromDate) {
      newErrors.fromDate = t("leaves.validation.fromDateRequired", "Please select a start date")
    } else {
      const fromDate = new Date(formData.fromDate)
      const todayDate = new Date(today)
      if (fromDate < todayDate) {
        newErrors.fromDate = t("leaves.validation.fromDatePast", "Start date cannot be in the past")
      }
      // Check if start date is a workday
      if (!isWorkDay(fromDate)) {
        newErrors.fromDate = isArabic
          ? "تاريخ البداية يجب أن يكون يوم عمل"
          : "Start date must be a workday"
      }
    }

    if (!formData.toDate) {
      newErrors.toDate = t("leaves.validation.toDateRequired", "Please select an end date")
    } else if (formData.fromDate) {
      const fromDate = new Date(formData.fromDate)
      const toDate = new Date(formData.toDate)
      if (toDate < fromDate) {
        newErrors.toDate = t("leaves.validation.toDateBeforeFrom", "End date cannot be before start date")
      }
      // Check if end date is a workday
      if (!isWorkDay(toDate)) {
        newErrors.toDate = isArabic
          ? "تاريخ النهاية يجب أن يكون يوم عمل"
          : "End date must be a workday"
      }
    }

    // Validate available leaves vs requested days
    if (formData.numberOfDays > 0 && formData.numberOfDays > availableLeaves) {
      newErrors.numberOfDays = isArabic
        ? `لا توجد إجازات متاحة كافية. المتاح: ${availableLeaves} يوم`
        : `Insufficient available leaves. Available: ${availableLeaves} days`
    }

    if (
      !newErrors.fromDate &&
      !newErrors.toDate &&
      formData.fromDate &&
      formData.toDate &&
      hasOverlappingLeave(formData.fromDate, formData.toDate)
    ) {
      const overlapMessage = t(
        "leaves.validation.overlap",
        "You already have a leave request covering these dates"
      )
      newErrors.fromDate = overlapMessage
      newErrors.toDate = overlapMessage
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.reason.trim()) {
      newErrors.reason = t("leaves.validation.reasonRequired", "Please provide a reason for your leave")
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = t("leaves.validation.reasonTooShort", "Reason must be at least 10 characters long")
    } else if (formData.reason.trim().length > 500) {
      newErrors.reason = t("leaves.validation.reasonTooLong", "Reason cannot exceed 500 characters")
    }

    // Validate file if it's sick leave
    if (formData.leaveType === "sick" && formData.attachment) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (formData.attachment.size > maxSize) {
        newErrors.attachment = t("leaves.validation.fileTooLarge", "File size cannot exceed 10MB")
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(formData.attachment.type)) {
        newErrors.attachment = t("leaves.validation.invalidFileType", "Only PDF, DOC, DOCX, JPG, and PNG files are allowed")
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    // Final validation before submission
    return validateStep1() && validateStep2()
  }

  const handleSubmit = async () => {
    setSubmitError(null)

    // Final validation
    if (!validateStep3()) {
      toast.error(t("leaves.validation.pleaseFixErrors", "Please fix the errors before submitting"))
      return
    }

    // Prepare data for API
    const submitData = {
      leaveTypeId: formData.leaveTypeId,
      startDate: new Date(formData.fromDate).toISOString(),
      endDate: new Date(formData.toDate).toISOString(),
      reason: formData.reason.trim(),
    }

    try {
      await submitLeaveRequest(submitData).unwrap()

      toast.success(t("leaves.form.successToast", "Leave request submitted successfully!"))
      setShowSuccess(true)
      if (refetch) refetch()

      // Clear form after success
      setTimeout(() => {
        setCurrentStep(1)
        setFormData({
          leaveTypeId: "",
          fromDate: "",
          toDate: "",
          numberOfDays: 0,
          reason: "",
          attachment: null,
        })
        setErrors({})
        setShowSuccess(false)
        setSubmitError(null)
        localStorage.removeItem("leaveFormData")
      }, 3000)
    } catch (err) {
      setSubmitError(err)

      // Handle different types of errors
      let errorMessage = t("leaves.form.errorToast", "Failed to submit leave request. Please try again.")

      if (err?.data?.message) {
        errorMessage = err.data.message
      } else if (err?.message) {
        errorMessage = err.message
      } else if (err?.status === 400) {
        errorMessage = t("leaves.form.validationError", "Please check your input and try again")
      } else if (err?.status === 401) {
        errorMessage = t("leaves.form.unauthorized", "You are not authorized to perform this action")
      } else if (err?.status === 500) {
        errorMessage = t("leaves.form.serverError", "Server error. Please try again later")
      }

      const overlapFromServer =
        err?.data?.errorMessage?.toLowerCase?.().includes("overlap") ||
        err?.data?.message?.toLowerCase?.().includes("overlap") ||
        errorMessage?.toLowerCase?.().includes("overlap")

      if (overlapFromServer) {
        const overlapMessage = t(
          "leaves.validation.overlap",
          "You already have a leave request covering these dates"
        )
        setErrors((prev) => ({
          ...prev,
          fromDate: overlapMessage,
          toDate: overlapMessage,
        }))
        errorMessage = overlapMessage
      }

      toast.error(errorMessage)
    }
  }

  const handleNext = () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        handleSubmit()
        return
      default:
        isValid = false
    }

    if (isValid) {
      setCurrentStep(currentStep + 1)
      // Clear errors when moving to next step
      setErrors({})
    } else {
      toast.error(t("leaves.validation.pleaseFixErrors", "Please fix the errors before proceeding"))
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
      setSubmitError(null)
    }
  }

  // Check if there's any entered data
  const hasEnteredData = useMemo(() => {
    return !!(
      formData.leaveTypeId ||
      formData.fromDate ||
      formData.toDate ||
      formData.numberOfDays > 0 ||
      formData.reason.trim() ||
      formData.attachment
    )
  }, [formData])

  // Handle cancel/abort form
  const handleCancel = () => {
    // Show confirmation toast with approve/cancel buttons
    toast(
      (t) => (
        <div className="flex flex-col gap-3" style={{ color: "var(--text-color)" }}>
          <span className="text-sm font-medium">
            {isArabic
              ? "هل أنت متأكد من إلغاء طلب الإجازة؟ سيتم فقدان جميع البيانات المدخلة."
              : "Are you sure you want to cancel the leave request? All entered data will be lost."}
          </span>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id)
              }}
              className="px-3 py-1.5 text-xs rounded-md font-medium hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
              }}
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                // Confirm cancellation
                setCurrentStep(1)
                setFormData({
                  leaveTypeId: "",
                  fromDate: "",
                  toDate: "",
                  numberOfDays: 0,
                  reason: "",
                  attachment: null,
                })
                setErrors({})
                setSubmitError(null)
                setShowSuccess(false)
                localStorage.removeItem("leaveFormData")
                toast.success(
                  isArabic
                    ? "تم إلغاء طلب الإجازة"
                    : "Leave request cancelled"
                )
              }}
              className="px-3 py-1.5 text-xs rounded-md font-medium hover:opacity-90 transition-opacity text-white"
              style={{
                backgroundColor: "var(--error-color)",
              }}
            >
              {isArabic ? "تأكيد" : "Confirm"}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep toast open until user clicks a button
        icon: "⚠️",
        style: {
          backgroundColor: "var(--container-color)",
          color: "var(--text-color)",
          border: "1px solid var(--border-color)",
          minWidth: "300px",
        },
      }
    )
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Clear previous attachment errors
      setErrors(prev => ({ ...prev, attachment: null }))

      // Validate file size
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          attachment: t("leaves.validation.fileTooLarge", "File size cannot exceed 10MB")
        }))
        return
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          attachment: t("leaves.validation.invalidFileType", "Only PDF, DOC, DOCX, JPG, and PNG files are allowed")
        }))
        return
      }

      setFormData((prev) => ({ ...prev, attachment: file }))
    }
  }

  const getStepTitle = () => {
    if (showSuccess) {
      return t("leaves.form.step3Title").replace("Review & Submit", "Done")
    }
    switch (currentStep) {
      case 1:
        return t("leaves.form.step1Title")
      case 2:
        return t("leaves.form.step2Title")
      case 3:
        return t("leaves.form.step3Title")
      default:
        return t("leaves.form.step1Title")
    }
  }

  const renderProgressBar = () => (
    <div className="mb-2">
      <div className="w-full rounded-full h-1.5 mb-1" style={{ backgroundColor: "var(--border-color)" }}>
        <div
          className="gradient-bg h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: showSuccess ? "100%" : `${(currentStep / 3) * 100}%` }}
        />
      </div>
    </div>
  )

  const renderError = (errorKey) => {
    if (!errors[errorKey]) return null
    return (
      <div className="flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3" style={{ color: "var(--error-color)" }} />
        <span className="text-xs" style={{ color: "var(--error-color)" }}>
          {errors[errorKey]}
        </span>
      </div>
    )
  }

  const renderStep1 = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {leaveTypes.map((type) => (
          <label key={type.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="leaveTypeId"
              value={type.value}
              checked={formData.leaveTypeId === type.value}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, leaveTypeId: e.target.value }))
                setErrors(prev => ({ ...prev, leaveTypeId: null }))
              }}
              className="sr-only"
            />
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors`}
              style={{
                borderColor: formData.leaveTypeId === type.value ? "var(--accent-color)" : "var(--border-color)",
                backgroundColor: formData.leaveTypeId === type.value ? "var(--accent-color)" : "transparent",
              }}
            >
              {formData.leaveTypeId === type.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="font-medium text-xs" style={{ color: "var(--text-color)" }}>
              {type.label}
            </span>
          </label>
        ))}
      </div>
      {renderError("leaveTypeId")}
      {isLoadingLeaveTypes && (
        <div className="text-xs text-[var(--sub-text-color)]">Loading leave types...</div>
      )}
      {isErrorLeaveTypes && (
        <div className="text-xs text-[var(--error-color)]">Failed to load leave types</div>
      )}

      <div className="space-y-2">
        <div className="text-center">
          <label className="block font-medium text-xs mb-2" style={{ color: "var(--sub-text-color)" }}>
            {t("leaves.form.selectDate", "Select Date:")}
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.fromDate")}
            </label>
            <input
              type="date"
              min={today}
              value={formData.fromDate}
              onChange={(e) => handleDateChange("fromDate", e.target.value)}
              className={`w-full p-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 transition-colors ${errors.fromDate ? 'border-red-500' : ''
                }`}
              style={{
                borderColor: errors.fromDate ? "var(--error-color)" : "var(--border-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            />
            {renderError("fromDate")}
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.toDate")}
            </label>
            <input
              type="date"
              min={formData.fromDate || today}
              value={formData.toDate}
              onChange={(e) => handleDateChange("toDate", e.target.value)}
              className={`w-full p-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 transition-colors ${errors.toDate ? 'border-red-500' : ''
                }`}
              style={{
                borderColor: errors.toDate ? "var(--error-color)" : "var(--border-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            />
            {renderError("toDate")}
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.numberOfDays")}
            </label>
            <div
              className={`w-full p-1.5 rounded-md text-center font-semibold text-xs ${errors.numberOfDays ? 'border border-red-500' : ''
                }`}
              style={{
                backgroundColor: "var(--container-color)",
                color: "var(--text-color)"
              }}
            >
              {formData.numberOfDays} {t("leaves.form.days", "day")}
            </div>
            {renderError("numberOfDays")}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="flex flex-col h-full gap-3">
      {/* Reason Section */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-medium mb-1.5" style={{ color: "var(--text-color)" }}>
          {t("leaves.form.reasonLabel", "Reason for Leave")} <span style={{ color: "var(--error-color)" }}>*</span>
        </label>
        <div className="flex-1 relative">
          <textarea
            value={formData.reason}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
              setErrors(prev => ({ ...prev, reason: null }))
            }}
            placeholder={t("leaves.form.reasonPlaceholder")}
            rows={2}
            className={`w-full h-full p-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all ${errors.reason ? 'border-red-500 focus:ring-red-200' : 'focus:ring-opacity-20'
              }`}
            style={{
              borderColor: errors.reason ? "var(--error-color)" : "var(--border-color)",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              focusRingColor: "var(--accent-color)",
            }}
          />
          {/* Character Counter */}
          {formData.reason && (
            <div className={`absolute bottom-2 ${isArabic ? 'left-2' : 'right-2'} flex items-center gap-1.5`}>
              {formData.reason.length >= 10 && formData.reason.length <= 500 && (
                <CheckCircle className={`w-3 h-3 ${isArabic ? 'ml-1' : 'mr-1'}`} style={{ color: "var(--success-color)" }} />
              )}
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded"
                style={{
                  color: formData.reason.length > 500 ? "var(--error-color)" :
                    formData.reason.length >= 10 ? "var(--success-color)" : "var(--sub-text-color)",
                  backgroundColor: "var(--container-color)"
                }}
              >
                {formData.reason.length}/500
              </span>
            </div>
          )}
        </div>
        {renderError("reason")}
      </div>

      {/* Show upload section only for sick leave */}
      {(() => {
        const selectedType = leaveTypes.find(t => t.value === formData.leaveTypeId)
        return selectedType?.label?.toLowerCase() === "sick" && (
        <div className="flex-shrink-0 space-y-2">
          <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
            <label className="text-xs font-medium" style={{ color: "var(--text-color)" }}>
              {t("leaves.form.attachment", "Medical Document")} <span style={{ color: "var(--error-color)" }}>*</span>
            </label>
            {formData.attachment && (
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, attachment: null }))
                  setErrors(prev => ({ ...prev, attachment: null }))
                }}
                className="text-xs font-medium hover:opacity-70 transition-opacity flex items-center gap-1"
                style={{ color: "var(--error-color)" }}
              >
                <span>×</span> {t("leaves.form.remove", "Remove")}
              </button>
            )}
          </div>

          {formData.attachment ? (
            <div
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${errors.attachment ? 'border-red-500' : ''
                }`}
              style={{
                backgroundColor: "var(--container-color)",
                borderColor: errors.attachment ? "var(--error-color)" : "var(--border-color)"
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--accent-color)" }}
              >
                <File className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs truncate" style={{ color: "var(--text-color)" }}>
                  {formData.attachment.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--sub-text-color)" }}>
                  {(formData.attachment.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--success-color)" }} />
            </div>
          ) : (
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 transition-all hover:border-opacity-80 cursor-pointer group ${errors.attachment ? 'border-red-500' : ''
                }`}
              style={{
                borderColor: errors.attachment ? "var(--error-color)" : "var(--accent-color)",
                backgroundColor: "var(--container-color)"
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <p className="font-semibold text-xs mb-0.5" style={{ color: "var(--text-color)" }}>
                    {t("leaves.form.uploadImageOrDocument", "Upload Medical Document")}
                  </p>
                  <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                    {t("leaves.form.supportedFormats", "PDF, DOC, JPG up to 10MB")}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById("file-upload").click()
                  }}
                  className="px-4 py-1.5 text-white rounded-lg font-medium hover:opacity-90 transition-all text-xs gradient-bg shadow-sm hover:shadow"
                >
                  {t("leaves.form.browse", "Browse")}
                </button>
              </div>
            </div>
          )}
          {renderError("attachment")}
        </div>
      )})()}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-3">
      {submitError && (
        <div className="p-2 rounded-lg border border-red-500 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-red-700">
              {submitError?.data?.message || submitError?.message || t("leaves.form.submitError", "An error occurred while submitting")}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="container-color p-3 rounded-lg" style={{ backgroundColor: "var(--container-color)" }}>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium" style={{ color: "var(--text-color)" }}>
              Type:
            </span>
            <span style={{ color: "var(--sub-text-color)" }}>
              {leaveTypes.find((type) => type.value === formData.leaveTypeId)?.label || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium" style={{ color: "var(--text-color)" }}>
              Days:
            </span>
            <span style={{ color: "var(--sub-text-color)" }}>{formData.numberOfDays}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium" style={{ color: "var(--text-color)" }}>
              Dates:
            </span>
            <span style={{ color: "var(--sub-text-color)" }}>
              {formData.fromDate &&
                formData.toDate &&
                `${new Date(formData.fromDate).toLocaleDateString()} – ${new Date(formData.toDate).toLocaleDateString()}`}
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="font-medium" style={{ color: "var(--text-color)" }}>
              Reason:
            </span>
            <span
              style={{
                color: "var(--sub-text-color)",
                display: "inline-block",
                maxWidth: 180,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                verticalAlign: "bottom",
              }}
              title={formData.reason}
            >
              {formData.reason}
            </span>
          </div>
        </div>
        {formData.attachment && (
          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--container-color)" }}>
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-xs"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <File className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-xs" style={{ color: "var(--text-color)" }}>
                {formData.attachment.name}
              </p>
              <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                • Preview • {(formData.attachment.size / (1024 * 1024)).toFixed(1)}MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-full bg-all rounded-xl p-4 text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-3">
          <img src="/assets/done.svg" alt="Success" width="32" height="48" />
        </div>
        <h3 className="text-sm gradient-text font-semibold mb-1">Your request has been sent</h3>
        <p className="text-xs gradient-text text-center">to your manager for approval</p>
      </div>
    </div>
  )

  // Load form data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("leaveFormData")
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setFormData(parsedData)
      } catch (error) {
        localStorage.removeItem("leaveFormData")
      }
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("leaveFormData", JSON.stringify(formData))
    } catch (error) {
      // Error saving form data
    }
  }, [formData])

  // Recalculate days when workdays are loaded or change
  useEffect(() => {
    if (formData.fromDate && formData.toDate && userWorkDays && userWorkDays.length > 0) {
      const calculatedDays = calculateDays(formData.fromDate, formData.toDate)
      if (calculatedDays !== formData.numberOfDays) {
        setFormData(prev => ({
          ...prev,
          numberOfDays: calculatedDays
        }))
      }
    }
  }, [userWorkDays, formData.fromDate, formData.toDate, calculateDays])

  return (
    <div
      className="rounded-xl p-2 sm:p-3 md:p-4 lg:p-2 xl:p-3 2xl:p-6 border shadow-sm h-full flex flex-col relative"
      style={{
        backgroundColor: "var(--bg-color)",
        borderColor: "var(--border-color)",
        minHeight: "260px sm:280px lg:260px xl:280px 2xl:280px",
        maxHeight: "260px sm:280px lg:260px xl:280px 2xl:280px",
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mb-2">
        <h2 className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-sm font-semibold gradient-text mb-2" dir="ltr">
          {getStepTitle()}
        </h2>
        {renderProgressBar()}
      </div>
      <div className="flex-1 overflow-hidden">
        {showSuccess ? (
          renderSuccess()
        ) : (
          <>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </>
        )}
      </div>
      {!showSuccess && (
        <div className="flex justify-between mt-2 sm:mt-3 lg:mt-2 xl:mt-3 2xl:mt-3 pt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-2">
            <p className="text-[10px] sm:text-xs lg:text-[10px] xl:text-xs 2xl:text-xs" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.step", "Step")} {currentStep} {t("leaves.form.of", "of")} 3
            </p>
            {/* Cancel button - only show if there's entered data */}
            {hasEnteredData && (
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-2 py-1 border rounded-md font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-[10px] sm:text-xs lg:text-[10px] xl:text-xs 2xl:text-xs flex items-center gap-1"
                style={{
                  borderColor: "var(--error-color)",
                  color: "var(--error-color)",
                  backgroundColor: "transparent",
                }}
                title={isArabic ? "إلغاء" : "Cancel"}
              >
                <X className="w-3 h-3" />
                {t("leaves.form.cancel", "Cancel")}
              </button>
            )}
          </div>
          <div className="flex gap-1.5 sm:gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2">
            {currentStep !== 1 && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-2 sm:px-3 lg:px-2 xl:px-3 2xl:px-3 py-1 border rounded-md font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-[10px] sm:text-xs lg:text-[10px] xl:text-xs 2xl:text-xs"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--sub-text-color)",
                  backgroundColor: "var(--bg-color)",
                }}
              >
                {t("leaves.form.back", "Back")}
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-2 sm:px-3 lg:px-2 xl:px-3 2xl:px-3 py-1 gradient-bg opacity-100 text-white rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed text-[10px] sm:text-xs lg:text-[10px] xl:text-xs 2xl:text-xs flex items-center gap-1 sm:gap-2 lg:gap-1 xl:gap-2 2xl:gap-2"
            >
              {isSubmitting && currentStep === 3 && (
                <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 2xl:w-3 2xl:h-3 animate-spin" />
              )}
              {currentStep === 3
                ? isSubmitting
                  ? t("leaves.form.submitting", "Submitting...")
                  : t("leaves.form.submit", "Submit")
                : t("leaves.form.next", "Next")
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveRequest
