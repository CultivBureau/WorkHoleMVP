import { useState } from "react";
import { useGetCompanyByIdQuery, useUpdateCompanyMutation } from "../../../services/apis/CompanyApi";
import { getCompanyId } from "../../../utils/page";
import { useTranslation } from "react-i18next";

const CompanyDetailsCard = () => {
  const { t } = useTranslation();
  const companyId = getCompanyId();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const { data: companyData, isLoading, error, refetch } = useGetCompanyByIdQuery(companyId, {
    skip: !companyId,
  });

  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const company = companyData?.value;

  // Update local state when company data loads
  if (company && companyName === "" && !isEditing) {
    setCompanyName(company.name);
  }

  const handleEdit = () => {
    setIsEditing(true);
    setCompanyName(company.name);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCompanyName(company.name);
  };

  const handleSave = async () => {
    try {
      await updateCompany({ companyId, name: companyName }).unwrap();
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Failed to update company:", error);
    }
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
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="btn-secondary whitespace-nowrap disabled:opacity-50"
                    >
                      Cancel
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Name
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
      </div>
    </div>
  );
};

export default CompanyDetailsCard;
