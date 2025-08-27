"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Upload, File } from "lucide-react"
import { useCreateLeaveMutation } from "../../services/apis/LeavesApi"
import { toast } from "react-hot-toast"

const LeaveRequest = () => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === "ar"

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

  // RTK Query mutation
  const [createLeave, { isLoading: isSubmitting }] = useCreateLeaveMutation()

  const leaveTypes = [
    { value: "annual", label: t("leaves.types.annual"), icon: "🗓️" },
    { value: "sick", label: t("leaves.types.sick"), icon: "🤒" },
    { value: "emergency", label: t("leaves.types.emergency"), icon: "🚨" },
    { value: "unpaid", label: t("leaves.types.unpaid"), icon: "💼" },
  ]

  const today = new Date().toISOString().split("T")[0]

  const calculateDays = (from, to) => {
    if (from && to) {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      const diffTime = Math.abs(toDate - fromDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const handleDateChange = (field, value) => {
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
    // Prepare data for API
    const data = {
      leaveType: getApiLeaveType(formData.leaveType),
      startDate: formData.fromDate,
      endDate: formData.toDate,
      reason: formData.reason,
    }
    try {
      await createLeave({
        data,
        file: formData.attachment || undefined,
      }).unwrap()
      toast.success(t("leaves.form.successToast", "Leave request submitted!"))
      setShowSuccess(true)
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
        setShowSuccess(false)
      }, 3000)
    } catch (err) {
      toast.error(
        t("leaves.form.errorToast", "Failed to submit leave request. Please try again.")
      )
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 3) {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    setFormData((prev) => ({ ...prev, attachment: file }))
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
              onChange={(e) => setFormData((prev) => ({ ...prev, leaveType: e.target.value }))}
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
              className="w-full p-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 transition-colors"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.toDate")}
            </label>
            <input
              type="date"
              min={today}
              value={formData.toDate}
              onChange={(e) => handleDateChange("toDate", e.target.value)}
              className="w-full p-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 transition-colors"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.numberOfDays")}
            </label>
            <div
              className="w-full p-1.5 rounded-md text-center font-semibold text-xs"
              style={{ backgroundColor: "var(--container-color)", color: "var(--text-color)" }}
            >
              {formData.numberOfDays} {t("leaves.form.days", "day")}
            </div>
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
          onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
          placeholder={t("leaves.form.reasonPlaceholder")}
          rows={2}
          className="w-full h-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 resize-none transition-colors"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
        />
      </div>
      {/* Show upload section only for sick leave */}
      {formData.leaveType === "sick" && (
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
              {t("leaves.form.attachment")}
            </p>
            {formData.attachment && (
              <button
                onClick={() => setFormData((prev) => ({ ...prev, attachment: null }))}
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: "var(--error-color)" }}
              >
                {t("leaves.form.remove", "Remove")}
              </button>
            )}
          </div>
          {formData.attachment ? (
            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--container-color)" }}>
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
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className="w-30 h-20 p-1 flex-shrink-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderColor: "var(--accent-color)" }}
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
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-3">
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
              maxWidth: 180, // adjust as needed
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
      setFormData(JSON.parse(saved))
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("leaveFormData", JSON.stringify(formData))
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
              disabled={isSubmitting}
              className="px-3 py-1 gradient-bg text-white rounded-md font-medium hover:opacity-90 transition-opacity text-xs"
            >
              {currentStep === 3 ? t("leaves.form.submit", "Submit") : t("leaves.form.next", "Next")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveRequest
