"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Upload } from "lucide-react"

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

  const leaveTypes = [
    { value: "annual", label: t("leaves.types.annual"), icon: "🗓️" },
    { value: "sick", label: t("leaves.types.sick"), icon: "🤒" },
    { value: "emergency", label: t("leaves.types.emergency"), icon: "🚨" },
    { value: "unpaid", label: t("leaves.types.unpaid"), icon: "💼" },
  ]

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

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 3) {
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
    <div className="mb-4">
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
            Select Date:
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--sub-text-color)" }}>
              From
            </label>
            <input
              type="date"
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
              To
            </label>
            <input
              type="date"
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
              No of Days
            </label>
            <div
              className="w-full p-1.5 rounded-md text-center font-semibold text-xs"
              style={{ backgroundColor: "var(--container-color)", color: "var(--text-color)" }}
            >
              {formData.numberOfDays} day
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-3">
      <div>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
          placeholder="Enter Your leave reason"
          rows={2}
          className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 resize-none transition-colors"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
        />
      </div>
      <div>
        <p className="text-xs mb-2" style={{ color: "var(--sub-text-color)" }}>
          You can attach a medical document
        </p>
        {formData.attachment ? (
          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--container-color)" }}>
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-xs"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              📄
            </div>
            <div className="flex-1">
              <p className="font-medium text-xs" style={{ color: "var(--text-color)" }}>
                {formData.attachment.name}
              </p>
              <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                • Preview • {(formData.attachment.size / (1024 * 1024)).toFixed(1)}MB
              </p>
            </div>
            <button
              onClick={() => setFormData((prev) => ({ ...prev, attachment: null }))}
              className="text-xs hover:opacity-70 transition-opacity"
              style={{ color: "var(--error-color)" }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:opacity-80 transition-opacity"
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
            <Upload className="w-6 h-6 mx-auto mb-1" style={{ color: "var(--sub-text-color)" }} />
            <p className="font-medium mb-1 text-xs" style={{ color: "var(--text-color)" }}>
              Upload Image or Drag and Drop
            </p>
            <button className="px-3 py-1 text-white rounded-md font-medium hover:opacity-90 transition-opacity text-xs gradient-bg">
              Browse
            </button>
          </div>
        )}
      </div>
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
          <span style={{ color: "var(--sub-text-color)" }}>{formData.reason}</span>
        </div>
        {formData.attachment && (
          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--container-color)" }}>
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-xs"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              📄
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

  const DoneSVG = () => (
    <svg width="32" height="48" viewBox="0 0 42 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4738 0.249686C3.42614 3.30868 1.6694 23.197 14.9844 28.4321C15.9786 28.823 15.9835 28.8276 18.2333 31.5088C19.4726 32.9856 20.5408 34.2138 20.6071 34.2384C20.6734 34.2628 21.7236 33.0803 22.9411 31.6106L25.1543 28.9385L26.3566 28.4205C39.2398 22.8686 38.1193 4.43104 24.6575 0.462177C22.9128 -0.0522076 19.3446 -0.157816 17.4738 0.249686ZM29.1086 6.93868C30.5132 7.659 31.0745 9.2251 30.4159 10.5856C30.1051 11.2276 19.2792 21.3043 18.2442 21.915C16.7559 22.793 15.8021 22.3416 13.2284 19.5414C10.2553 16.3065 9.90628 15.2384 11.3304 13.732C12.7313 12.2502 14.2832 12.4573 16.0574 14.3627L17.1306 15.5152L21.7302 11.2905C27.0993 6.35911 27.5081 6.11785 29.1086 6.93868ZM27.3549 8.0838C27.1954 8.14844 24.9228 10.1661 22.3049 12.5672C16.4254 17.96 17.2983 17.5412 15.6064 15.7817C13.8813 13.9878 13.2433 13.757 12.3202 14.5925C11.4798 15.3529 11.7519 15.96 14.0616 18.4811C16.401 21.0346 16.8365 21.2899 17.7621 20.6503C18.1512 20.3817 28.2662 11.1446 28.8895 10.4891C29.9674 9.35511 28.7863 7.50369 27.3549 8.0838ZM1.87916 38.521C1.55633 38.6675 1.25571 38.8463 1.21128 38.9183C1.12206 39.0627 18.9381 56.9101 19.3941 57.1333C19.9254 57.3931 20.7393 57.4647 21.348 57.3052C21.8994 57.1606 40.0918 39.3338 40.0918 38.9379C40.0918 38.1776 3.51426 37.7784 1.87916 38.521ZM32.8054 40.1765C33.1754 40.4357 33.2134 40.8385 32.8979 41.1541C32.6983 41.3538 31.3871 41.3777 20.6011 41.3777H8.52792L8.3065 41.0614C8.02154 40.6546 8.02719 40.5821 8.36969 40.2396C8.76262 39.8465 32.2477 39.7859 32.8054 40.1765ZM0.172314 40.2599C-0.027977 40.5705 -0.0683997 60.9594 0.129707 61.6781C0.356946 62.5022 1.1044 63.3261 1.95782 63.6932L2.67104 64L20.848 63.9623C41.0579 63.9204 39.3475 64.0071 40.3815 62.9729C41.3411 62.0133 41.2963 62.5437 41.3462 51.5486C41.3788 44.3343 41.3454 41.3802 41.2251 40.8256L41.0588 40.0601L32.0758 49.0326C22.2149 58.882 22.3948 58.7282 20.7353 58.7311C18.9228 58.7342 19.4685 59.1952 9.41867 49.1683C2.68324 42.4479 0.264266 40.1175 0.172314 40.2599ZM27.5452 43.3975C27.8169 43.6692 27.7437 44.187 27.3997 44.4279C26.9746 44.7258 14.5024 44.7609 13.9174 44.466C13.4891 44.25 13.3897 43.775 13.7067 43.458C14.007 43.1577 27.2475 43.1 27.5452 43.3975Z"
        fill="url(#paint0_linear_2_4514)"
      />
      <defs>
        <linearGradient id="paint0_linear_2_4514" x1="41.358" y1="32" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#09D1C7" />
          <stop offset="1" stopColor="#15919B" />
        </linearGradient>
      </defs>
    </svg>
  )

  const renderSuccess = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-full gradient-bg rounded-xl p-4 text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-3">
          <DoneSVG />
        </div>
        <h3 className="text-sm font-semibold mb-1">Your request has been sent</h3>
        <p className="text-xs text-center">to your manager for approval</p>
      </div>
    </div>
  )

  return (
    <div
      className="rounded-xl p-3 border shadow-sm h-full flex flex-col relative"
      style={{
        backgroundColor: "var(--bg-color)",
        borderColor: "var(--border-color)",
        minHeight: "280px", // Set fixed height to match summary cards
        maxHeight: "280px",
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mb-3">
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
              Step {currentStep} of 3
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
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-3 py-1 gradient-bg text-white rounded-md font-medium hover:opacity-90 transition-opacity text-xs"
            >
              {currentStep === 3 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveRequest
