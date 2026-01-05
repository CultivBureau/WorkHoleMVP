import { useState, useEffect, useRef } from "react";
import { useGetCompanyByIdQuery, useUpdateCompanyDetailsMutation, useAddAttachmentMutation, useUpdateAttachmentMutation, useDeleteAttachmentMutation } from "../../../services/apis/CompanyApi";
import { getCompanyId } from "../../../utils/page";
import { useTranslation } from "react-i18next";
import { Edit, Save, X, Upload, File, Calendar, Clock, MoreVertical, Eye, Trash2, Building2, Network, Tag, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { useHasPermission } from "../../../hooks/useHasPermission";

const CompanyDetailsCard = () => {
  const { t } = useTranslation();
  const companyId = getCompanyId();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showAddAttachmentModal, setShowAddAttachmentModal] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState(null);
  
  // Permission checks
  const canUpdateCompany = useHasPermission('Company.Update');

  const { data: companyData, isLoading, error, refetch } = useGetCompanyByIdQuery(companyId, {
    skip: !companyId,
    refetchOnMountOrArgChange: true,
  });

  const [updateCompanyDetails, { isLoading: isUpdating }] = useUpdateCompanyDetailsMutation();
  const [updateAttachment] = useUpdateAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);

  const company = companyData?.value;

  // Initialize state when company data loads
  useEffect(() => {
    if (company && !isEditing) {
      setCompanyName(company.name || "");
      // Initialize attachments from API response
      if (company.attachments && Array.isArray(company.attachments) && company.attachments.length > 0) {
        setAttachments(
          company.attachments.map((att) => ({
            id: att.id || null, // UUID string from backend
            attachmentID: att.attachmentID || null, // Number ID
            internalId: att.id || null, // UUID string from backend (same as id)
            file: null, // No file initially, only when user uploads new one
            fileName: att.fileName || "", // File name string
            expiryDate: formatExpiryDate(att.expiryDate || ""), // Convert to YYYY-MM-DD format
            filePath: att.filePath, // Keep original file path for display
            fileContent: null, // Not provided by API
            canView: att.canView !== undefined ? att.canView : true, // Permission flag, default to true
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
    if (company.attachments && Array.isArray(company.attachments) && company.attachments.length > 0) {
      setAttachments(
        company.attachments.map((att) => ({
          id: att.id || null, // UUID string from backend
          attachmentID: att.attachmentID || null, // Number ID
          internalId: att.id || null, // UUID string from backend (same as id)
          file: null,
          fileName: att.fileName || "", // File name string
          expiryDate: formatExpiryDate(att.expiryDate || ""), // Convert to YYYY-MM-DD format
          filePath: att.filePath,
          fileContent: null, // Not provided by API
          canView: att.canView !== undefined ? att.canView : true, // Permission flag, default to true
        }))
      );
    } else {
      setAttachments([]);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCompanyName(company.name || "");
    if (company.attachments && Array.isArray(company.attachments) && company.attachments.length > 0) {
      setAttachments(
        company.attachments.map((att) => ({
          id: att.id || null, // UUID string from backend
          attachmentID: att.attachmentID || null, // Number ID
          internalId: att.id || null, // UUID string from backend (same as id)
          file: null,
          fileName: att.fileName || "", // File name string
          expiryDate: formatExpiryDate(att.expiryDate || ""), // Convert to YYYY-MM-DD format
          filePath: att.filePath,
          fileContent: null, // Not provided by API
          canView: att.canView !== undefined ? att.canView : true, // Permission flag, default to true
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


  const handleAddAttachment = () => {
    setShowAddAttachmentModal(true);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };

    if (openMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuIndex]);

  const handleViewAttachment = (attachment) => {
    if (attachment.filePath) {
      const fileUrl = getFileUrl(attachment.filePath);
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error(t("company.noFileToView", "No file available to view"));
    }
  };


  const handleDeleteAttachment = async (attachment) => {
    if (!attachment.id) {
      toast.error(t("company.invalidAttachment", "Invalid attachment"));
      return;
    }

    if (!window.confirm(t("company.confirmDelete", "Are you sure you want to delete this attachment?"))) {
      return;
    }

    try {
      await deleteAttachment(attachment.id).unwrap();
      toast.success(t("company.deleteSuccess", "Attachment deleted successfully"));
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = error?.data?.errorMessage || error?.data?.message || error?.message;
      toast.error(errorMessage || t("company.deleteError", "Failed to delete attachment"));
    }
  };

  const handleToggleCanView = async (attachment) => {
    if (!attachment.id) {
      toast.error(t("company.invalidAttachment", "Invalid attachment"));
      return;
    }

    try {
      await updateAttachment({
        id: attachment.id, // UUID string
        fileName: attachment.fileName || undefined,
        attachmentID: attachment.attachmentID || undefined,
        expiryDate: attachment.expiryDate || undefined,
        canView: !attachment.canView,
      }).unwrap();
      toast.success(t("company.updateSuccess", "Attachment updated successfully"));
      refetch();
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error?.data?.errorMessage || error?.data?.message || error?.message;
      toast.error(errorMessage || t("company.updateError", "Failed to update attachment"));
    }
  };

  const handleUpdateAttachment = (attachment) => {
    setEditingAttachment(attachment);
    setShowAddAttachmentModal(true);
    setOpenMenuIndex(null);
  };

  const getPlanTypeName = (planType) => {
    const plans = {
      0: t("company.planTypes.free"),
      1: t("company.planTypes.basic"),
      2: t("company.planTypes.professional"),
      3: t("company.planTypes.enterprise"),
    };
    return plans[planType] || t("company.planTypes.unknown");
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
            <span className="font-semibold">{t("company.error.loadFailed")}</span>
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
    <div className="w-full space-y-6">
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
        
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content */}
            <div className="flex-1 space-y-3">
              {isEditing ? (
                <div className="space-y-1.5">
                  <label
                    className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                    style={{ color: "var(--sub-text-color)" }}
                  >
                    <div className="w-0.5 h-2.5 rounded-full" style={{ background: "var(--accent-color)" }} />
                    {t("company.companyName", "Company Name")}
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input text-xl sm:text-2xl font-bold w-full border-2 rounded-lg px-3 py-2 transition-all duration-200 focus:ring-2"
                    placeholder={t("company.enterName", "Enter company name")}
                    style={{
                      background: "var(--container-color)",
                      color: "var(--text-color)",
                      borderColor: "var(--accent-color)",
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    className="text-2xl sm:text-3xl font-black text-start tracking-tight"
                    style={{ 
                      color: "var(--text-color)",
                      lineHeight: "1.1"
                    }}
                  >
                    {company.name}
                  </h2>
                  
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold text-xs shadow-sm ${
                      company.status
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                        : "bg-gradient-to-r from-rose-500 to-rose-600 text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
                    {company.status ? t("company.active", "Active") : t("company.inactive", "Inactive")}
                  </span>



               
                </div>
              )}
            </div>

            {/* Right Action Buttons - Only show if user has update permission */}
            {canUpdateCompany && (
              <div className="flex flex-row gap-2 sm:flex-row lg:min-w-[200px] lg:justify-end">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{
                        background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)",
                        color: "white",
                      }}
                    >
                      <Save className="w-4 h-4" />
                      {isUpdating ? t("company.saving", "Saving...") : t("company.save", "Save")}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "var(--container-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <X className="w-4 h-4" />
                      {t("company.cancel", "Cancel")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)",
                      color: "white",
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    {t("company.edit", "Edit")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 pt-6">
            <SummaryCard
              label={t("company.companyType", "Company Type")}
              icon={<Building2 className="w-3.5 h-3.5" />}
              value={company.companyTypeName || t("company.companyTypeName.unknown", "Unknown Company Type")}
            />
            <SummaryCard
              label={t("company.parentCompany", "Parent Company")}
              icon={<Network className="w-3.5 h-3.5" />}
              value={company.parentCompany?.name || company.parentCompanyName || t("company.noParentCompany", "None")}
            />
            <SummaryCard
              label={t("company.category", "Category")}
              icon={<Tag className="w-3.5 h-3.5" />}
              value={company.category?.name || company.categoryName || t("company.noCategory", "None")}
            />
            <SummaryCard
              label={t("company.companyId", "Company ID")}
              icon={<Hash className="w-3.5 h-3.5" />}
              value={company.id}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Attachments Section */}
        <section
          className="rounded-2xl border p-5 lg:col-span-3 overflow-hidden w-full"
          style={{
            background: "var(--bg-color)",
            borderColor: "var(--border-color)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between border-b" style={{ borderColor: "var(--border-color)" }}>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)" }}>
                  <File className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-color)" }}>
                  {t("company.attachments", "Attachments")}
                </h3>
              </div>
              <p className="text-xs font-medium pl-9 text-start" style={{ color: "var(--sub-text-color)" }}>
                {attachments.length > 0
                  ? t("company.attachmentsSubtitle", "Manage documents")
                  : t("company.attachmentsEmpty", "No documents yet")}
              </p>
            </div>

            {/* Add Attachment Button - Only show if user has update permission */}
            {canUpdateCompany && (
              <button
                onClick={handleAddAttachment}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)",
                  color: "white",
                }}
              >
                <Upload className="w-4 h-4" />
                {t("company.addAttachment", "Add Attachment")}
              </button>
            )}
          </div>

          {attachments.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8 mt-4"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="p-2 rounded-lg" style={{ background: "var(--container-color)" }}>
                <File className="w-8 h-8" style={{ color: "var(--sub-text-color)" }} />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-xs font-semibold" style={{ color: "var(--text-color)" }}>
                  {t("company.noAttachments", "No attachments")}
                </p>
                <p className="text-[10px]" style={{ color: "var(--sub-text-color)" }}>
                  Upload documents to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {attachments.map((attachment, index) => (
                <div
                  key={attachment.id || index}
                  className="relative rounded-xl border p-4 transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: "var(--container-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {/* Three-dot menu */}
                  {canUpdateCompany && (
                    <div className="absolute top-3 right-3" ref={openMenuIndex === index ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ 
                          color: "var(--text-color)",
                          backgroundColor: openMenuIndex === index ? "var(--hover-color)" : "transparent"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = openMenuIndex === index ? "var(--hover-color)" : "transparent"}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openMenuIndex === index && (
                        <div 
                          className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-10"
                          style={{
                            background: "var(--bg-color)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <button
                            onClick={() => {
                              handleViewAttachment(attachment);
                              setOpenMenuIndex(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left hover:bg-[var(--hover-color)]"
                            style={{ color: "var(--text-color)" }}
                          >
                            <Eye className="w-4 h-4" />
                            {t("company.view", "View")}
                          </button>
                          <div className="border-t" style={{ borderColor: "var(--border-color)" }} />
                          <button
                            onClick={() => {
                              handleUpdateAttachment(attachment);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left hover:bg-[var(--hover-color)]"
                            style={{ color: "var(--text-color)" }}
                          >
                            <Edit className="w-4 h-4" />
                            {t("company.update", "Update")}
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteAttachment(attachment);
                              setOpenMenuIndex(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left hover:bg-[var(--hover-color)]"
                            style={{ color: "var(--error-color)" }}
                          >
                            <Trash2 className="w-4 h-4" />
                            {t("company.remove", "Remove")}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Icon and Name */}
                  <div className="flex items-start gap-3 mb-4 pr-8">
                    <div className="p-3 rounded-lg flex-shrink-0" style={{ background: "var(--bg-color)" }}>
                      <File className="w-6 h-6" style={{ color: "var(--accent-color)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate" style={{ color: "var(--text-color)" }}>
                        {attachment.fileName || attachment.filePath?.split("/").pop() || t("company.unnamedFile", "Unnamed File")}
                      </h4>
                      {attachment.attachmentID && (
                        <p className="text-xs mt-1" style={{ color: "var(--sub-text-color)" }}>
                          ID: {attachment.attachmentID}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4" style={{ color: "var(--accent-color)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                      {attachment.expiryDate 
                        ? new Date(attachment.expiryDate).toLocaleDateString()
                        : t("company.noExpiry", "No expiry")}
                    </span>
                  </div>

                  {/* Can View Toggle */}
                  {canUpdateCompany && (
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
                      <span className="text-xs font-medium" style={{ color: "var(--sub-text-color)" }}>
                        {t("company.canView", "Can View")}
                      </span>
                      <button
                        onClick={() => handleToggleCanView(attachment)}
                        disabled={false}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          attachment.canView ? 'bg-gradient-to-r from-[#15919B] to-[#09D1C7]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            attachment.canView ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add/Edit Attachment Modal */}
        {showAddAttachmentModal && (
          <AddAttachmentModal
            companyId={companyId}
            attachment={editingAttachment}
            onClose={() => {
              setShowAddAttachmentModal(false);
              setEditingAttachment(null);
            }}
            onSuccess={() => {
              setShowAddAttachmentModal(false);
              setEditingAttachment(null);
              refetch();
            }}
            t={t}
          />
        )}
      </div>
    </div>
  );
};

// Add/Edit Attachment Modal Component
const AddAttachmentModal = ({ companyId, attachment = null, onClose, onSuccess, t }) => {
  const isEditing = !!attachment;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [attachmentID, setAttachmentID] = useState("");
  const [canView, setCanView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addAttachment] = useAddAttachmentMutation();
  const [updateAttachment] = useUpdateAttachmentMutation();

  // Initialize form with attachment data when editing
  useEffect(() => {
    if (attachment) {
      setFileName(attachment.fileName || "");
      setExpiryDate(attachment.expiryDate || "");
      setAttachmentID(attachment.attachmentID ? attachment.attachmentID.toString() : "");
      setCanView(attachment.canView !== undefined ? attachment.canView : true);
      setFile(null); // Don't pre-fill file, user can choose to update it
    } else {
      // Reset form for new attachment
      setFileName("");
      setExpiryDate("");
      setAttachmentID("");
      setCanView(false);
      setFile(null);
    }
  }, [attachment]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill file name if empty
      if (!fileName) {
        setFileName(selectedFile.name);
      }
    }
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // File is required only when adding new attachment
    if (!isEditing && !file) {
      toast.error(t("company.fileRequired", "Please select a file"));
      return;
    }

    if (!fileName || fileName.trim() === "") {
      toast.error(t("company.fileNameRequired", "Please enter a file name"));
      return;
    }

    setIsSubmitting(true);
    try {
      // Helper function to format expiry date for API
      const formatExpiryDateForAPI = (dateString) => {
        if (!dateString) return null;
        if (dateString.includes("/")) {
          const [month, day, year] = dateString.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateString;
      };

      if (isEditing) {
        // Update existing attachment
        await updateAttachment({
          id: attachment.id, // UUID string
          fileName: fileName.trim(),
          file: file || undefined, // File is optional when updating
          attachmentID: attachmentID ? parseInt(attachmentID) : undefined,
          expiryDate: formatExpiryDateForAPI(expiryDate) || undefined,
          canView: canView,
        }).unwrap();

        toast.success(t("company.attachmentUpdated", "Attachment updated successfully"));
      } else {
        // Add new attachment
        await addAttachment({
          companyId,
          fileName: fileName.trim(),
          file: file,
          attachmentID: attachmentID ? parseInt(attachmentID) : undefined,
          expiryDate: formatExpiryDateForAPI(expiryDate) || undefined,
          canView: canView,
        }).unwrap();

        toast.success(t("company.attachmentAdded", "Attachment added successfully"));
      }

      onSuccess();
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} attachment:`, error);
      const errorMessage = error?.data?.errorMessage || error?.data?.message || error?.message;
      toast.error(errorMessage || t(`company.attachment${isEditing ? 'Update' : 'Add'}Error`, `Failed to ${isEditing ? 'update' : 'add'} attachment`));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div 
        className="w-full max-w-md rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-color)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ color: "var(--text-color)" }}>
              {isEditing ? t("company.updateAttachment", "Update Attachment") : t("company.addAttachment", "Add Attachment")}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg transition-colors hover:bg-opacity-10"
              style={{ color: "var(--text-color)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* File Upload */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
              <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
              {t("company.file", "File")} {!isEditing && "*"}
              {isEditing && <span className="text-xs text-[var(--sub-text-color)] ml-1">({t("company.optional", "Optional")})</span>}
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                required={!isEditing}
              />
              <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid" style={{
                borderColor: file ? "var(--accent-color)" : "var(--border-color)",
                background: "var(--container-color)",
              }}>
                <Upload className="w-5 h-5" style={{ color: "var(--accent-color)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  {file 
                    ? file.name 
                    : isEditing && attachment?.filePath
                      ? t("company.currentFile", "Current: {fileName}", { fileName: attachment.fileName || attachment.filePath.split("/").pop() })
                      : t("company.selectFile", "Select a file")}
                </span>
              </div>
            </label>
            {isEditing && attachment?.filePath && !file && (
              <p className="text-xs mt-1" style={{ color: "var(--sub-text-color)" }}>
                {t("company.fileNotChanged", "Leave empty to keep current file")}
              </p>
            )}
          </div>

          {/* File Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
              <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
              {t("company.fileNameLabel", "File Name")} *
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="form-input w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-4"
              placeholder={t("company.fileNamePlaceholder", "Enter file name")}
              required
              style={{ background: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
            />
          </div>

          {/* ID */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
              <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
              {t("company.attachmentId", "Attachment ID")}
            </label>
            <input
              type="number"
              value={attachmentID}
              onChange={(e) => setAttachmentID(e.target.value)}
              className="form-input w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-4"
              placeholder={t("company.enterId", "Enter ID (optional)")}
              style={{ background: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
              <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
              {t("company.expiryDate", "Expiry Date")}
            </label>
            <input
              type="date"
              value={formatExpiryDate(expiryDate)}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="form-input w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-4"
              style={{ background: "var(--bg-color)", color: "var(--text-color)", borderColor: "var(--border-color)" }}
            />
          </div>

          {/* Can View Toggle */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2" style={{ color: "var(--sub-text-color)" }}>
              <div className="w-1 h-3 rounded-full" style={{ background: "var(--accent-color)" }} />
              {t("company.canView", "Can View")}
            </label>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl border-2" style={{ borderColor: "var(--border-color)", background: "var(--bg-color)" }}>
              <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                {canView ? t("company.yes", "Yes") : t("company.no", "No")}
              </span>
              <button
                type="button"
                onClick={() => setCanView(!canView)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  canView ? 'bg-gradient-to-r from-[#15919B] to-[#09D1C7]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    canView ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg font-bold text-sm border transition-all duration-200 disabled:opacity-50"
              style={{
                background: "var(--container-color)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              {t("company.cancel", "Cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)",
                color: "white",
              }}
            >
              {isSubmitting 
                ? (isEditing ? t("company.updating", "Updating...") : t("company.submitting", "Submitting...")) 
                : (isEditing ? t("company.update", "Update") : t("company.submit", "Submit"))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, hint, hintTone = "default" }) => {
  return (
    <div
      className="rounded-lg border p-3 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
      style={{
        background: "var(--container-color)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--sub-text-color)" }}>
        <div className="p-1 rounded" style={{ background: "var(--bg-color)" }}>
          {icon}
        </div>
        {label}
      </div>
      <p
        className="text-base font-bold"
        style={{ color: "var(--text-color)" }}
      >
        {value}
      </p>
      {hint && (
        <p
          className="mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded inline-block"
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

const MetaItem = ({ label, value, accent = "default" }) => {
  const toneMap = {
    default: {
      badge: "border",
      bg: "var(--bg-color)",
      color: "var(--text-color)",
      borderColor: "var(--border-color)",
    },
    success: {
      badge: "shadow-sm",
      bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
      color: "#10b981",
      borderColor: "#10b981",
    },
    warning: {
      badge: "shadow-sm",
      bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
      color: "#f59e0b",
      borderColor: "#f59e0b",
    },
  };

  const tone = toneMap[accent] || toneMap.default;

  return (
    <div className="flex flex-col gap-1.5 p-2.5 rounded-lg border transition-all duration-200 hover:shadow-sm" style={{ borderColor: "var(--border-color)", background: "var(--container-color)" }}>
      <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--sub-text-color)" }}>
        <div className="w-0.5 h-2 rounded-full" style={{ background: "var(--accent-color)" }} />
        {label}
      </span>
      <span
        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${tone.badge}`}
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
