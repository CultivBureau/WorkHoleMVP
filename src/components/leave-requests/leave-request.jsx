"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Upload, File, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useCreateLeaveMutation } from "../../services/apis/LeavesApi"
import { toast } from "react-hot-toast"
import { useMeQuery } from "../../services/apis/AuthApi"

const LeaveRequest = ({ refetch }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === "ar"

  // Get user data including holidays
  const { data: user } = useMeQuery()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    leaveType: "annual",
    fromDate: "",
    toDate: "",
    numberOfDays: 0,
    reason: "",
    attachment: null,
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // RTK Query mutation
  const [createLeave, { isLoading: isSubmitting }] = useCreateLeaveMutation()

  const leaveTypes = [
    { value: "annual", label: t("leaves.types.annual") },
    { value: "sick", label: t("leaves.types.sick") },
    { value: "emergency", label: t("leaves.types.emergency") },
    { value: "unpaid", label: t("leaves.types.unpaid") },
  ]

  const today = new Date().toISOString().split("T")[0]

  // Helper to check if date is a user holiday (dynamic based on /me)
  const isUserHoliday = (date) => {
    if (!user?.holidays || user.holidays.length === 0) return false
    const day = new Date(date).getDay()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[day]
    return user.holidays.includes(dayName)
  }

  // Helper to count only valid working days (excluding user holidays only)
  const calculateDays = (from, to) => {
    if (from && to) {
      let fromDate = new Date(from)
      let toDate = new Date(to)
      if (toDate < fromDate) return 0
      let count = 0
      while (fromDate <= toDate) {
        const day = fromDate.getDay()
        const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        const dayName = dayNames[day]
        
        // Skip ONLY user holidays (remove static Friday/Saturday check)
        if (!user?.holidays?.includes(dayName)) {
          count++
        }
        fromDate.setDate(fromDate.getDate() + 1)
      }
      return count
    }
    return 0
  }

  const handleDateChange = (field, value) => {
    const selectedDate = new Date(value)
    const day = selectedDate.getDay()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[day]
    
    // Clear previous errors for this field
    setErrors(prev => ({ ...prev, [field]: null }))
    
    // Check ONLY if it's a user holiday (remove static Friday/Saturday check)
    if (user?.holidays?.includes(dayName)) {
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
          ? `${dayLabels[dayName]} يوم إجازة لك. لا يمكنك اختياره.`
          : `${dayLabels[dayName]} is your holiday. You cannot select it.`
      )
      return
    }
    
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      if (field === "fromDate" || field === "toDate") {
        newData.numberOfDays = calculateDays(
          field === "fromDate" ? value : prev.fromDate,
          field === "toDate" ? value : prev.toDate,
        )
      }
      return newData
    })
  }

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.leaveType) {
      newErrors.leaveType = t("leaves.validation.leaveTypeRequired", "Please select a leave type")
    }
    
    if (!formData.fromDate) {
      newErrors.fromDate = t("leaves.validation.fromDateRequired", "Please select a start date")
    } else {
      const fromDate = new Date(formData.fromDate)
      const todayDate = new Date(today)
      if (fromDate < todayDate) {
        newErrors.fromDate = t("leaves.validation.fromDatePast", "Start date cannot be in the past")
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
    }
    
    if (formData.numberOfDays <= 0) {
      newErrors.numberOfDays = t("leaves.validation.invalidDays", "Please select valid dates")
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

  // Map frontend leaveType to API value
  const getApiLeaveType = (type) => {
    switch (type) {
      case "annual":
        return "Annual Leave"
      case "sick":
        return "Sick Leave"
      case "emergency":
        return "Emergency Leave"
      case "unpaid":
        return "Unpaid Leave"
      default:
        return "Annual Leave"
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setSubmitError(null)
    
    // Final validation
    if (!validateStep3()) {
      setIsLoading(false)
      toast.error(t("leaves.validation.pleaseFixErrors", "Please fix the errors before submitting"))
      return
    }

    // Prepare data for API
    const data = {
      leaveType: getApiLeaveType(formData.leaveType),
      startDate: formData.fromDate,
      endDate: formData.toDate,
      reason: formData.reason.trim(),
    }
    
    try {
      await createLeave({
        data,
        file: formData.attachment || undefined,
      }).unwrap()
      
      toast.success(t("leaves.form.successToast", "Leave request submitted successfully!"))
      setShowSuccess(true)
      if (refetch) refetch()
      
      // Clear form after success
      setTimeout(() => {
        setCurrentStep(1)
        setFormData({
          leaveType: "annual",
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
      console.error("Error submitting leave request:", err)
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
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
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
              name="leaveType"
              value={type.value}
              checked={formData.leaveType === type.value}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, leaveType: e.target.value }))
                setErrors(prev => ({ ...prev, leaveType: null }))
              }}
              className="sr-only"
            />
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors`}
              style={{
                borderColor: formData.leaveType === type.value ? "var(--accent-color)" : "var(--border-color)",
                backgroundColor: formData.leaveType === type.value ? "var(--accent-color)" : "transparent",
              }}
            >
              {formData.leaveType === type.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="font-medium text-xs" style={{ color: "var(--text-color)" }}>
              {type.label}
            </span>
          </label>
        ))}
      </div>
      {renderError("leaveType")}
      
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
              className={`w-full p-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 transition-colors ${
                errors.fromDate ? 'border-red-500' : ''
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
              className={`w-full p-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 transition-colors ${
                errors.toDate ? 'border-red-500' : ''
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
              className={`w-full p-1.5 rounded-md text-center font-semibold text-xs ${
                errors.numberOfDays ? 'border border-red-500' : ''
              }`}
              style={{ 
                backgroundColor: errors.numberOfDays ? "var(--error-color)" : "var(--container-color)", 
                color: errors.numberOfDays ? "white" : "var(--text-color)" 
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
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <textarea
          value={formData.reason}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, reason: e.target.value }))
            setErrors(prev => ({ ...prev, reason: null }))
          }}
          placeholder={t("leaves.form.reasonPlaceholder")}
          rows={2}
          className={`w-full h-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 resize-none transition-colors ${
            errors.reason ? 'border-red-500' : ''
          }`}
          style={{
            borderColor: errors.reason ? "var(--error-color)" : "var(--border-color)",
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
        />
        {renderError("reason")}
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs" style={{ color: "var(--sub-text-color)" }}>
            {formData.reason.length}/500 {t("leaves.form.characters", "characters")}
          </span>
          {formData.reason.length >= 10 && formData.reason.length <= 500 && (
            <CheckCircle className="w-3 h-3" style={{ color: "var(--success-color)" }} />
          )}
        </div>
      </div>
      
      {/* Show upload section only for sick leave */}
      {formData.leaveType === "sick" && (
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.attachment")} <span className="text-red-500">*</span>
            </p>
            {formData.attachment && (
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, attachment: null }))
                  setErrors(prev => ({ ...prev, attachment: null }))
                }}
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: "var(--error-color)" }}
              >
                {t("leaves.form.remove", "Remove")}
              </button>
            )}
          </div>
          {formData.attachment ? (
            <div className={`flex items-center gap-2 p-2 rounded-lg border ${
              errors.attachment ? 'border-red-500' : ''
            }`} style={{ backgroundColor: "var(--container-color)" }}>
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--accent-color)" }}
              >
                <span className="text-xs"><File className="w-4 h-4" /></span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium text-xs break-all"
                  style={{ color: "var(--text-color)" }}
                >
                  {formData.attachment.name}
                </p>
                <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                  {(formData.attachment.size / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>
              <CheckCircle className="w-4 h-4" style={{ color: "var(--success-color)" }} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className={`w-30 h-20 p-1 flex-shrink-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${
                  errors.attachment ? 'border-red-500' : ''
                }`}
                style={{ borderColor: errors.attachment ? "var(--error-color)" : "var(--accent-color)" }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
                <Upload className="w-4 h-4 mb-1" style={{ color: "var(--sub-text-color)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                  {t("leaves.form.upload")}
                </span>
                <button
                  onClick={() => document.getElementById("file-upload").click()}
                  className="px-4 py-1 mt-0.5 text-white rounded-md font-medium hover:opacity-90 transition-opacity text-xs gradient-bg"
                >
                  {t("leaves.form.browse")}
                </button>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium mb-1 text-xs" style={{ color: "var(--text-color)" }}>
                  {t("leaves.form.uploadImageOrDocument", "Upload Image or Document")}
                </p>
                <p className="text-xs mb-2" style={{ color: "var(--sub-text-color)" }}>
                  {t("leaves.form.supportedFormats", "PDF, DOC, JPG up to 10MB")}
                </p>
              </div>
            </div>
          )}
          {renderError("attachment")}
        </div>
      )}
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
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium" style={{ color: "var(--text-color)" }}>
            Type:
          </span>
          <span style={{ color: "var(--sub-text-color)" }}>
            {leaveTypes.find((type) => type.value === formData.leaveType)?.label}
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
      <div className="w-full h-full gradient-bg rounded-xl p-4 text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-3">
          <img src="/assets/done.svg" alt="Success" width="32" height="48" />
        </div>
        <h3 className="text-sm font-semibold mb-1">Your request has been sent</h3>
        <p className="text-xs text-center">to your manager for approval</p>
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
        console.error("Error parsing saved form data:", error)
        localStorage.removeItem("leaveFormData")
      }
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("leaveFormData", JSON.stringify(formData))
    } catch (error) {
      console.error("Error saving form data:", error)
    }
  }, [formData])

  return (
    <div
      className="rounded-xl p-3 border shadow-sm h-full flex flex-col relative"
      style={{
        backgroundColor: "var(--bg-color)",
        borderColor: "var(--border-color)",
        minHeight: "280px",
        maxHeight: "280px",
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mb-2">
        <h2 className="text-sm font-semibold gradient-text mb-2" dir="ltr">
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
        <div className="flex justify-between mt-3 pt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div>
            <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.step", "Step")} {currentStep} {t("leaves.form.of", "of")} 3
            </p>
          </div>
          <div className="flex gap-2">
            {currentStep !== 1 && (
              <button
                onClick={handleBack}
                disabled={isSubmitting || isLoading}
                className="px-3 py-1 border rounded-md font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
              disabled={isSubmitting || isLoading}
              className="px-3 py-1 gradient-bg text-white rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed text-xs flex items-center gap-2"
            >
              {(isSubmitting || isLoading) && currentStep === 3 && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {currentStep === 3
                ? (isSubmitting || isLoading)
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
