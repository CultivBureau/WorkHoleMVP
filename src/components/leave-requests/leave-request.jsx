import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Upload, FileText, ChevronDown } from "lucide-react";
import CustomPopup from "../ui/custom-popup";

const LeaveRequest = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    leaveType: "annual",
    fromDate: "",
    toDate: "",
    numberOfDays: "",
    reason: "",
    attachment: null,
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const leaveTypes = [
    { value: "annual", label: "leaves.types.annual", icon: "/assets/leaves/anual.svg" },
    { value: "sick", label: "leaves.types.sick", icon: "/assets/leaves/sick.svg" },
    { value: "emergency", label: "leaves.types.emergency", icon: "/assets/leaves/emergency.svg" },
    { value: "unpaid", label: "leaves.types.unpaid", icon: "/assets/leaves/unpaid.svg" },
  ];

  const calculateDays = (from, to) => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return "";
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === "fromDate" || field === "toDate") {
        newData.numberOfDays = calculateDays(
          field === "fromDate" ? value : prev.fromDate,
          field === "toDate" ? value : prev.toDate
        );
      }
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setShowSuccessPopup(true);
    // Reset form after successful submission
    setTimeout(() => {
      setCurrentStep(1);
      setFormData({
        leaveType: "annual",
        fromDate: "",
        toDate: "",
        numberOfDays: "",
        reason: "",
        attachment: null,
      });
    }, 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFormData(prev => ({ ...prev, attachment: file }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              {t("leaves.form.step1Title")}
            </h3>
            
            {/* Leave Type Selection */}
            <div className="grid grid-cols-2 gap-3">
              {leaveTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFormData(prev => ({ ...prev, leaveType: type.value }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.leaveType === type.value
                      ? "border-[var(--accent-color)] bg-[var(--hover-color)]"
                      : "border-[var(--border-color)] hover:border-[var(--accent-color)]"
                  }`}
                  style={{ backgroundColor: formData.leaveType === type.value ? "var(--hover-color)" : "transparent" }}
                >
                  <div className="flex items-center gap-3">
                    <img src={type.icon} alt={type.value} className="w-6 h-6" />
                    <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                      {t(type.label)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--sub-text-color)" }}>
                  {t("leaves.form.fromDate")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => handleDateChange("fromDate", e.target.value)}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--text-color)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--sub-text-color)" }}>
                  {t("leaves.form.toDate")}
                </label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleDateChange("toDate", e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--sub-text-color)" }}>
                  {t("leaves.form.numberOfDays")}
                </label>
                <input
                  type="text"
                  value={formData.numberOfDays}
                  readOnly
                  className="w-full p-3 border rounded-xl bg-gray-50"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--container-color)",
                    color: "var(--text-color)",
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              {t("leaves.form.step2Title")}
            </h3>

            {/* Reason Input */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--sub-text-color)" }}>
                {t("leaves.form.reason")}
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder={t("leaves.form.reasonPlaceholder")}
                rows={4}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-color)",
                  color: "var(--text-color)",
                }}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--sub-text-color)" }}>
                {t("leaves.form.attachment")}
              </label>
              <div
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-[var(--accent-color)] transition-colors"
                style={{ borderColor: "var(--border-color)" }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--sub-text-color)" }} />
                <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                  {formData.attachment
                    ? formData.attachment.name
                    : t("leaves.form.uploadFile")}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--sub-text-color)" }}>
                  {t("leaves.form.supportedFormats")}
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              {t("leaves.form.step3Title")}
            </h3>

            {/* Review Information */}
            <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: "var(--container-color)" }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                    {t("leaves.form.type")}:
                  </span>
                  <p className="font-medium" style={{ color: "var(--text-color)" }}>
                    {t(`leaves.types.${formData.leaveType}`)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                    {t("leaves.form.days")}:
                  </span>
                  <p className="font-medium" style={{ color: "var(--text-color)" }}>
                    {formData.numberOfDays}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                    {t("leaves.form.dates")}:
                  </span>
                  <p className="font-medium" style={{ color: "var(--text-color)" }}>
                    {formData.fromDate} - {formData.toDate}
                  </p>
                </div>
                {formData.attachment && (
                  <div>
                    <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                      {t("leaves.form.attachment")}:
                    </span>
                    <p className="font-medium" style={{ color: "var(--text-color)" }}>
                      {formData.attachment.name}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                  {t("leaves.form.reason")}:
                </span>
                <p className="font-medium" style={{ color: "var(--text-color)" }}>
                  {formData.reason}
                </p>
              </div>
            </div>

            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: "var(--hover-color)" }}>
              <p className="text-sm" style={{ color: "var(--text-color)" }}>
                {t("leaves.form.submitMessage")}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="rounded-2xl p-6 border shadow-sm"
        style={{
          backgroundColor: "var(--bg-color)",
          borderColor: "var(--border-color)",
        }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step <= currentStep ? "gradient-bg text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      step < currentStep ? "bg-[var(--accent-color)]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
            {t("leaves.form.step")} {currentStep} {t("leaves.form.of")} 3
          </p>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className={`flex justify-between mt-6 ${isArabic ? "flex-row-reverse" : ""}`}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 border rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
            }}
          >
            {t("leaves.form.back")}
          </button>

          <button
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            className="px-6 py-2 gradient-bg text-white rounded-xl font-medium transition-all duration-200 hover:opacity-90"
          >
            {currentStep === 3 ? t("leaves.form.submit") : t("leaves.form.next")}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      <CustomPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title={t("leaves.form.successTitle")}
        message={t("leaves.form.successMessage")}
        type="success"
      />
    </>
  );
};

export default LeaveRequest;

