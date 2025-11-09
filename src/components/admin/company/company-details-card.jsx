import { useState, useEffect } from "react";
import { useGetCompanyByIdQuery, useUpdateCompanyDetailsMutation } from "../../../services/apis/CompanyApi";
import { getCompanyId } from "../../../utils/page";
import { useTranslation } from "react-i18next";
import { Edit, Save, X, Upload, File, Calendar } from "lucide-react";
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
            internalId: att.internalId || null, // UUID string
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
          internalId: att.internalId || null, // UUID string
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
          internalId: att.internalId || null, // UUID string
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
          internalId: att.internalId, // UUID string
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

  const handleAttachmentInternalIdChange = (index, internalId) => {
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...newAttachments[index],
      internalId: internalId || null,
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
    <div className="w-full p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-start gradient-text mb-1">
            Company Overview
          </h2>
          <p style={{ color: "var(--sub-text-color)" }} className="text-sm">
            Manage your company information and settings
          </p>
        </div>
      </div>

      {/* Main Company Card */}
      <div 
        className="rounded-2xl p-8 border"
        style={{ 
          background: "var(--bg-color)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow-color)"
        }}
      >
        {/* Company Name Section */}
        <div className="mb-8 pb-6" style={{ borderBottom: "2px solid var(--divider-color)" }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-3 text-start" style={{ color: "var(--sub-text-color)" }}>
                Company Name
              </label>
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input flex-1"
                    placeholder="Enter company name"
                    style={{ 
                      background: "var(--bg-color)",
                      color: "var(--text-color)",
                      borderColor: "var(--accent-color)"
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isUpdating || !companyName.trim()}
                      className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {isUpdating ? t("company.saving", "Saving...") : t("company.save", "Save")}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="btn-secondary whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      {t("company.cancel", "Cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>
                    {company.name}
                  </h3>
                  <button
                    onClick={handleEdit}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    {t("company.edit", "Edit Details")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <div 
            className="rounded-xl p-6 border-l-4"
            style={{ 
              background: "var(--container-color)",
              borderLeftColor: company.status ? "#10b981" : "#ef4444"
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "var(--sub-text-color)" }}>
                Status
              </span>
              <div className={`w-3 h-3 rounded-full ${company.status ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                company.status
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {company.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Plan Type Card */}
          <div 
            className="rounded-xl p-6 border-l-4"
            style={{ 
              background: "var(--container-color)",
              borderLeftColor: "var(--accent-color)"
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "var(--sub-text-color)" }}>
                Plan Type
              </span>
              <svg className="w-5 h-5" style={{ color: "var(--accent-color)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getPlanTypeColor(company.planType)}`}>
              {getPlanTypeName(company.planType)}
            </span>
          </div>



          {/* Start Plan Date Card */}
          <div 
            className="rounded-xl p-6 border-l-4"
            style={{ 
              background: "var(--container-color)",
              borderLeftColor: "var(--accent-color)"
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "var(--sub-text-color)" }}>
                Plan Start Date
              </span>
              <svg className="w-5 h-5" style={{ color: "var(--info-color)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
              {formatDate(company.startPlanDate)}
            </p>
          </div>

          {/* End Plan Date Card */}
          <div 
            className="rounded-xl p-6 border-l-4"
            style={{ 
              background: "var(--container-color)",
              borderLeftColor: daysRemaining && daysRemaining < 30 ? "var(--warning-color)" : "var(--info-color)"
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "var(--sub-text-color)" }}>
                Plan End Date
              </span>
              <svg className="w-5 h-5" style={{ color: daysRemaining && daysRemaining < 30 ? "var(--warning-color)" : "var(--info-color)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
              {formatDate(company.endPlanDate)}
            </p>
            {daysRemaining !== null && (
              <p className="text-sm mt-2" style={{ color: daysRemaining < 30 ? "var(--warning-color)" : "var(--sub-text-color)" }}>
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
              </p>
            )}
          </div>

          {/* Company ID Card */}
          <div 
            className="rounded-xl p-6 border-l-4"
            style={{ 
              background: "var(--container-color)",
              borderLeftColor: "var(--accent-color)"
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "var(--sub-text-color)" }}>
                Company ID
              </span>
              <svg className="w-5 h-5" style={{ color: "var(--sub-text-color)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <p className="text-xs font-mono break-all" style={{ color: "var(--sub-text-color)" }}>
              {company.id}
            </p>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="mt-8 pt-6" style={{ borderTop: "2px solid var(--divider-color)" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
              {t("company.attachments", "Company Attachments")}
            </h3>
          </div>

          {attachments.length === 0 ? (
            <div className="text-center py-8">
              <File className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--sub-text-color)" }} />
              <p style={{ color: "var(--sub-text-color)" }}>
                {t("company.noAttachments", "No attachments available")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="rounded-xl p-4 border"
                  style={{
                    background: "var(--container-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    {/* File Display/Upload */}
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sub-text-color)" }}>
                            {t("company.file", "File")}
                          </label>
                          <div className="flex items-center gap-2">
                            {attachment.file ? (
                              <span className="text-sm" style={{ color: "var(--text-color)" }}>
                                {attachment.file.name}
                              </span>
                            ) : attachment.filePath ? (
                              <a
                                href={getFileUrl(attachment.filePath)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm flex items-center gap-2"
                                style={{ color: "var(--accent-color)" }}
                              >
                                <File className="w-4 h-4" />
                                {attachment.filePath.split("/").pop()}
                              </a>
                            ) : (
                              <span className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                {t("company.noFile", "No file")}
                              </span>
                            )}
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleAttachmentFileChange(index, file);
                                }}
                              />
                              <span className="btn-secondary text-sm flex items-center gap-2 px-3 py-1">
                                <Upload className="w-4 h-4" />
                                {attachment.file || attachment.filePath ? t("company.changeFile", "Change") : t("company.uploadFile", "Upload")}
                              </span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {attachment.filePath ? (
                            <a
                              href={getFileUrl(attachment.filePath)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-medium"
                              style={{ color: "var(--accent-color)" }}
                            >
                              <File className="w-4 h-4" />
                              {attachment.filePath.split("/").pop()}
                            </a>
                          ) : (
                            <span className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                              {t("company.noFile", "No file")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Attachment ID */}
                    {isEditing && (
                      <div className="w-full md:w-32">
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sub-text-color)" }}>
                          {t("company.attachmentId", "ID")}
                        </label>
                        <input
                          type="number"
                          value={attachment.id || ""}
                          onChange={(e) => handleAttachmentIdChange(index, e.target.value)}
                          className="form-input w-full"
                          style={{
                            background: "var(--bg-color)",
                            color: "var(--text-color)",
                          }}
                          placeholder={t("company.enterId", "Enter ID")}
                        />
                      </div>
                    )}

                    {/* Expiry Date */}
                    <div className="w-full md:w-48">
                      {isEditing ? (
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sub-text-color)" }}>
                            {t("company.expiryDate", "Expiry Date")}
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--sub-text-color)" }} />
                            <input
                              type="date"
                              value={formatExpiryDate(attachment.expiryDate)}
                              onChange={(e) => handleAttachmentExpiryChange(index, e.target.value)}
                              className="form-input w-full pl-10"
                              style={{
                                background: "var(--bg-color)",
                                color: "var(--text-color)",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="block text-sm font-semibold mb-1" style={{ color: "var(--sub-text-color)" }}>
                            {t("company.expiryDate", "Expiry Date")}
                          </span>
                          <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                            {attachment.expiryDate || t("company.noExpiry", "N/A")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Remove Button (only in edit mode) */}
                    {isEditing && (
                      <button
                        onClick={() => removeAttachment(index)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        style={{ color: "var(--error-color)" }}
                        title={t("company.removeAttachment", "Remove attachment")}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsCard;
