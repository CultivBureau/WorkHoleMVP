import { useState, useEffect } from "react";
import { useGetCompanyByIdQuery, useUpdateCompanyDetailsMutation } from "../../../services/apis/CompanyApi";
import { getCompanyId } from "../../../utils/page";
import { useTranslation } from "react-i18next";
import { Edit, Save, X, Upload, File, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

const CompanyDetailsCard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const companyId = getCompanyId();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [attachments, setAttachments] = useState([]);

  const { data: companyData, isLoading, error, refetch } = useGetCompanyByIdQuery(companyId, {
    skip: !companyId,
  });

  const [updateCompanyDetails, { isLoading: isUpdating }] = useUpdateCompanyDetailsMutation();

  const company = companyData?.value;

  // Initialize state when company data loads
  useEffect(() => {
    if (company && !isEditing) {
      setCompanyName(company.name || "");
      // Initialize attachments from companyAttachment
      if (company.companyAttachment?.attachments && company.companyAttachment.attachments.length > 0) {
        setAttachments(
          company.companyAttachment.attachments.map((att) => ({
            id: att.id,
            internalId: att.internalId || null, // UUID string from backend
            file: null, // No file initially, only when user uploads new one
            fileName: att.fileName || "", // File name string
            expiryDate: formatExpiryDate(att.expiryDate || ""), // Convert to YYYY-MM-DD format
            filePath: att.filePath, // Keep original file path for display
            fileContent: att.fileContent, // Keep original file content for display
          }))
        );
      } else {
        setAttachments([]);
      }
    }
  }, [company?.id, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setCompanyName(company.name || "");
    if (company.companyAttachment?.attachments) {
      setAttachments(
        company.companyAttachment.attachments.map((att) => ({
          id: att.id,
          internalId: att.internalId || null, // UUID string from backend
          file: null,
          fileName: att.fileName || "", // File name string
          expiryDate: formatExpiryDate(att.expiryDate || ""), // Convert to YYYY-MM-DD format
          filePath: att.filePath,
          fileContent: att.fileContent,
        }))
      );
    } else {
      setAttachments([]);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCompanyName(company.name || "");
    if (company.companyAttachment?.attachments) {
      setAttachments(
        company.companyAttachment.attachments.map((att) => ({
          id: att.id,
          internalId: att.internalId || null, // UUID string from backend
          file: null,
          fileName: att.fileName || "", // File name string
          expiryDate: formatExpiryDate(att.expiryDate || ""), // Convert to YYYY-MM-DD format
          filePath: att.filePath,
          fileContent: att.fileContent,
        }))
      );
    } else {
      setAttachments([]);
    }
  };

  const handleSave = async () => {
    try {
      await updateCompanyDetails({
        companyId,
        name: companyName,
        attachments: attachments.map((att) => ({
          id: att.id,
          internalId: att.internalId || null, // UUID string - preserve from API or null for new attachments
          file: att.file, // File object if new upload, null if keeping existing
          fileName: att.fileName || (att.file instanceof File ? att.file.name : ""), // File name
          expiryDate: formatExpiryDate(att.expiryDate), // Format date to YYYY-MM-DD
        })),
      }).unwrap();
      
      setIsEditing(false);
      toast.success(t("company.updateSuccess", "Company details updated successfully"));
      refetch();
    } catch (error) {
      console.error("Failed to update company:", error);
      toast.error(t("company.updateError", "Failed to update company details"));
    }
  };

  const handleAttachmentFileChange = (index, file) => {
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...newAttachments[index],
      file: file,
      fileName: file ? file.name : newAttachments[index].fileName || "", // Set fileName when file is selected
    };
    setAttachments(newAttachments);
  };

  const handleAttachmentFileNameChange = (index, fileName) => {
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...newAttachments[index],
      fileName: fileName,
    };
    setAttachments(newAttachments);
  };

  const handleAttachmentExpiryChange = (index, expiryDate) => {
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...newAttachments[index],
      expiryDate: expiryDate,
    };
    setAttachments(newAttachments);
  };

  const handleAttachmentIdChange = (index, id) => {
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...newAttachments[index],
      id: id ? parseInt(id) : null,
    };
    setAttachments(newAttachments);
  };

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  const getPlanTypeName = (planType) => {
    const plans = {
      0: "Free",
      1: "Basic",
      2: "Professional",
      3: "Enterprise",
    };
    return plans[planType] || "Unknown";
  };

  const getPlanTypeColor = (planType) => {
    const colors = {
      1: "bg-blue-100 text-blue-800",
      2: "bg-purple-100 text-purple-800",
      3: "bg-gradient-to-r from-[#15919B] to-[#09D1C7] text-white",
    };
    return colors[planType] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "";
    // Handle MM/DD/YYYY format
    if (dateString.includes("/")) {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString;
  };

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 rounded-xl w-1/3" style={{ background: "var(--container-color)" }}></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl" style={{ background: "var(--container-color)" }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="w-full p-6">
        <div className="rounded-xl p-6 border-2" style={{ 
          background: "var(--bg-color)", 
          borderColor: "var(--error-color)",
          color: "var(--error-color)"
        }}>
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Failed to load company details</span>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(company.endPlanDate);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${baseUrl}${filePath}`;
  };

  return (
    <div className="w-full space-y-8">
      {/* Hero Header Section */}
      <section
        className="rounded-3xl border overflow-hidden"
        style={{
          background: "var(--bg-color)",
          borderColor: "var(--border-color)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Gradient Top Bar */}
        <div 
          className="h-2 w-full"
          style={{
            background: "linear-gradient(90deg, #15919B 0%, #09D1C7 100%)",
          }}
        />
        
        <div className="px-8 py-10 sm:px-12 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <label
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "var(--sub-text-color)" }}
                >
                  <div className="w-1 h-4 rounded-full" style={{ background: "var(--accent-color)" }} />
                  {t("company.companyName", "Company Name")}
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input text-3xl font-bold w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-4"
                    placeholder={t("company.enterName", "Enter company name")}
                    style={{
                      background: "var(--container-color)",
                      color: "var(--text-color)",
                      borderColor: "var(--accent-color)",
                    }}
                  />
                ) : (
                  <h2
                    className="text-4xl sm:text-5xl font-black text-start tracking-tight"
                    style={{ 
                      color: "var(--text-color)",
                      lineHeight: "1.1"
                    }}
                  >
                    {company.name}
                  </h2>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 font-bold text-sm shadow-sm transition-all duration-200 hover:scale-105 ${
                    company.status
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-rose-500 to-rose-600 text-white"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-lg animate-pulse" />
                  {company.status ? t("company.active", "Active") : t("company.inactive", "Inactive")}
                </span>

                <span
                  className="inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 font-bold text-sm shadow-sm border-2 transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--container-color) 0%, var(--bg-color) 100%)",
                    borderColor: "var(--accent-color)",
                    color: "var(--accent-color)",
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  {getPlanTypeName(company.planType)} Plan
                </span>

                {daysRemaining !== null && (
                  <span
                    className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 font-bold text-sm shadow-sm transition-all duration-200 hover:scale-105 ${
                      daysRemaining > 0
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                        : "bg-gradient-to-r from-rose-500 to-red-600 text-white"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {daysRemaining > 0
                      ? t("company.daysRemaining", {
                          defaultValue: "{{count}} days left",
                          count: daysRemaining,
                        })
                      : t("company.expired", "Expired")}
                  </span>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:min-w-[240px]">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)",
                      color: "white",
                    }}
                  >
                    <Save className="w-5 h-5" />
                    {isUpdating ? t("company.saving", "Saving...") : t("company.save", "Save Changes")}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "var(--container-color)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <X className="w-5 h-5" />
                    {t("company.cancel", "Cancel")}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)",
                    color: "white",
                  }}
                >
                  <Edit className="w-5 h-5" />
                  {t("company.edit", "Edit Details")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-8 pb-10 sm:px-12 sm:pb-12">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label={t("company.planStart", "Plan Start")}
              icon={<Calendar className="w-5 h-5" />}
              value={formatDate(company.startPlanDate)}
            />
            <SummaryCard
              label={t("company.planEnd", "Plan End")}
              icon={<Calendar className="w-5 h-5" />}
              value={formatDate(company.endPlanDate)}
              hint={
                daysRemaining !== null
                  ? daysRemaining > 0
                    ? t("company.daysRemainingShort", {
                        defaultValue: "{{count}} days left",
                        count: daysRemaining,
                      })
                    : t("company.expired", "Expired")
                  : undefined
              }
              hintTone={daysRemaining !== null && daysRemaining <= 0 ? "error" : "default"}
            />
            <SummaryCard
              label={t("company.planTier", "Current Tier")}
              icon={<Upload className="w-5 h-5 rotate-90" />}
              value={getPlanTypeName(company.planType)}
            />
            <SummaryCard
              label={t("company.companyId", "Company ID")}
              icon={<File className="w-5 h-5" />}
              value={company.id}
              isMono
            />
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Attachments Section */}
        <section
          className="rounded-3xl border p-8 lg:col-span-3 overflow-hidden w-full"
          style={{
            background: "var(--bg-color)",
            borderColor: "var(--border-color)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between border-b-2" style={{ borderColor: "var(--border-color)" }}>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)" }}>
                  <File className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                  {t("company.attachments", "Company Attachments")}
                </h3>
              </div>
              <p className="text-sm font-medium pl-14 text-start" style={{ color: "var(--sub-text-color)" }}>
                {attachments.length > 0
                  ? t("company.attachmentsSubtitle", "Manage documents and credentials")
                  : t("company.attachmentsEmpty", "No documents uploaded yet")}
              </p>
            </div>

    
          </div>

          {attachments.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-16 mt-8"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="p-4 rounded-2xl" style={{ background: "var(--container-color)" }}>
                <File className="w-12 h-12" style={{ color: "var(--sub-text-color)" }} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-semibold" style={{ color: "var(--text-color)" }}>
                  {t("company.noAttachments", "No attachments available")}
                </p>
                <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                  Upload documents to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 mt-8">
              {attachments.map((attachment, index) => (
                <article
                  key={index}
                  className="rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: "var(--container-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-5">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--sub-text-color)" }}>
                          <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
                          {t("company.file", "File")}
                        </span>

                        {isEditing ? (
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className="inline-flex min-h-[40px] items-center rounded-xl px-5 py-2 text-sm font-semibold border-2"
                              style={{
                                background: "var(--bg-color)",
                                color: "var(--text-color)",
                                borderColor: "var(--border-color)"
                              }}
                            >
                              {attachment.file?.name || attachment.fileName || t("company.noFile", "No file selected")}
                            </span>
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleAttachmentFileChange(index, file);
                                }}
                              />
                              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 shadow-md" style={{
                                background: "linear-gradient(135deg, var(--container-color) 0%, var(--bg-color) 100%)",
                                border: "2px solid var(--accent-color)",
                                color: "var(--accent-color)",
                              }}>
                                <Upload className="w-4 h-4" />
                                {attachment.file || attachment.filePath
                                  ? t("company.changeFile", "Change File")
                                  : t("company.uploadFile", "Upload File")}
                              </span>
                            </label>
                          </div>
                        ) : attachment.filePath ? (
                          <a
                            href={getFileUrl(attachment.filePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-base font-bold transition-all duration-200 hover:scale-105 w-fit"
                            style={{ color: "var(--accent-color)" }}
                          >
                            <div className="p-2 rounded-lg" style={{ background: "var(--bg-color)" }}>
                              <File className="w-5 h-5" />
                            </div>
                            {attachment.fileName || attachment.filePath.split("/").pop()}
                          </a>
                        ) : (
                          <span className="text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
                            {t("company.noFile", "No file")}
                          </span>
                        )}
                      </div>

                      {isEditing && (
                        <div className="grid gap-4">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
                              <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
                              {t("company.fileNameLabel", "File Name")}
                            </label>
                            <input
                              type="text"
                              value={attachment.fileName || ""}
                              onChange={(e) => handleAttachmentFileNameChange(index, e.target.value)}
                              className="form-input w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-4"
                              placeholder={t("company.fileNamePlaceholder", "Enter file name")}
                              style={{ background: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-start lg:flex-col lg:w-72">
                      {isEditing && (
                        <div className="w-full">
                          <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
                            <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
                            {t("company.attachmentId", "Attachment ID")}
                          </label>
                          <input
                            type="number"
                            value={attachment.id || ""}
                            onChange={(e) => handleAttachmentIdChange(index, e.target.value)}
                            className="form-input w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-4"
                            placeholder={t("company.enterId", "Enter ID")}
                            style={{ background: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
                          />
                        </div>
                      )}

                      <div className="w-full">
                        <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
                          <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
                          {t("company.expiryDate", "Expiry Date")}
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={formatExpiryDate(attachment.expiryDate)}
                            onChange={(e) => handleAttachmentExpiryChange(index, e.target.value)}
                            className="form-input w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-4"
                            style={{ background: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
                          />
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2" style={{ borderColor: "var(--border-color)", background: "var(--bg-color)" }}>
                            <Calendar className="w-4 h-4" style={{ color: "var(--accent-color)" }} />
                            <p className="text-sm font-bold" style={{ color: "var(--text-color)" }}>
                              {attachment.expiryDate || t("company.noExpiry", "N/A")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>


      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, hint, hintTone = "default", isMono = false }) => {
  return (
    <div
      className="rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-xl hover:scale-105"
      style={{
        background: "var(--container-color)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--sub-text-color)" }}>
        <div className="p-2 rounded-lg" style={{ background: "var(--bg-color)" }}>
          {icon}
        </div>
        {label}
      </div>
      <p
        className={`text-xl font-black ${isMono ? "font-mono text-base" : ""}`}
        style={{ color: "var(--text-color)" }}
      >
        {value}
      </p>
      {hint && (
        <p
          className="mt-3 text-xs font-bold px-3 py-1.5 rounded-lg inline-block"
          style={{
            background:
              hintTone === "error"
                ? "rgba(239, 68, 68, 0.1)"
                : hintTone === "warning"
                ? "rgba(245, 158, 11, 0.1)"
                : "var(--bg-color)",
            color:
              hintTone === "error"
                ? "#ef4444"
                : hintTone === "warning"
                ? "#f59e0b"
                : "var(--sub-text-color)",
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

const MetaItem = ({ label, value, isMono = false, accent = "default" }) => {
  const toneMap = {
    default: {
      badge: "border-2",
      bg: "var(--bg-color)",
      color: "var(--text-color)",
      borderColor: "var(--border-color)",
    },
    success: {
      badge: "shadow-md",
      bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
      color: "#10b981",
      borderColor: "#10b981",
    },
    warning: {
      badge: "shadow-md",
      bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)",
      color: "#f59e0b",
      borderColor: "#f59e0b",
    },
  };

  const tone = toneMap[accent] || toneMap.default;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md" style={{ borderColor: "var(--border-color)", background: "var(--container-color)" }}>
      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--sub-text-color)" }}>
        <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
        {label}
      </span>
      <span
        className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold ${tone.badge}`}
        style={{ 
          background: tone.bg,
          color: tone.color,
          borderColor: tone.borderColor,
        }}
      >
        {value}
      </span>
    </div>
  );
};

export default CompanyDetailsCard;
