import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Edit, RefreshCw, FileX, Calendar } from "lucide-react";
import { useGetMyLeavesQuery } from "../../services/apis/LeavesApi";

const LeaveTable = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [sortBy, setSortBy] = useState("newest");
  const [leaveType, setLeaveType] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 6;

  // Fetch leaves from API with polling for auto-refresh
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useGetMyLeavesQuery(
    { page: currentPage, limit: itemsPerPage },
    {
      // Auto-refresh every 30 seconds
      pollingInterval: 30000,
      // Refetch on window focus
      refetchOnFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    }
  );

  const leaves = data?.leaves || [];
  const pagination = data?.pagination || { page: 1, limit: itemsPerPage, total: 0, totalPages: 1 };

  // Auto-refresh when data changes (from external sources like new leave requests)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'leaveFormSubmitted' || e.key === 'leaveDataUpdated') {
        refetch();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    const handleCustomRefresh = () => {
      refetch();
    };

    window.addEventListener('leaveDataChanged', handleCustomRefresh);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leaveDataChanged', handleCustomRefresh);
    };
  }, [refetch]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter and sort data (client-side)
  const filteredData = useMemo(() => {
    let filtered = [...leaves];

    if (leaveType !== "all") {
      filtered = filtered.filter(item => item.leaveType.toLowerCase().includes(leaveType));
    }

    if (status !== "all") {
      filtered = filtered.filter(item => item.status.toLowerCase() === status);
    }

    if (dateFrom) {
      filtered = filtered.filter(item => new Date(item.startDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(item => new Date(item.endDate) <= new Date(dateTo));
    }

    // Sort data
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    return filtered;
  }, [leaves, sortBy, leaveType, status, dateFrom, dateTo]);

  // Pagination (API already paginates, but filters are client-side)
  const totalPages = pagination.totalPages;
  const totalEntries = pagination.total;
  const currentPageData = filteredData;

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: t("leaves.table.status.pending") },
      approved: { bg: "bg-green-100", text: "text-green-700", label: t("leaves.table.status.approved") },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: t("leaves.table.status.rejected") }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const SelectField = ({ value, onChange, options, label }) => (
    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
      <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--sub-text-color)' }}>
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="border rounded-full px-4 py-2 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[130px] font-medium"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            paddingRight: isArabic ? '16px' : '35px',
            paddingLeft: isArabic ? '35px' : '16px',
            direction: isArabic ? 'rtl' : 'ltr',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none ${isArabic ? 'left-3' : 'right-3'}`}
          style={{ color: 'var(--sub-text-color)' }}
        />
      </div>
    </div>
  );

  const DateField = ({ value, onChange, label }) => (
    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
      <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--sub-text-color)' }}>
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="border rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[130px] font-medium"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      />
    </div>
  );

  // Enhanced empty state component
  const renderEmptyState = () => {
    const hasFilters = leaveType !== "all" || status !== "all" || dateFrom || dateTo;
    
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" 
               style={{ backgroundColor: 'var(--container-color)' }}>
            {hasFilters ? (
              <FileX className="w-8 h-8" style={{ color: 'var(--sub-text-color)' }} />
            ) : (
              <Calendar className="w-8 h-8" style={{ color: 'var(--sub-text-color)' }} />
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
          {hasFilters 
            ? t("leaves.table.noResultsFound", "No Results Found") 
            : t("leaves.table.noDataAvailable", "No Data Available")
          }
        </h3>
        
        <p className="text-sm text-center mb-6 max-w-md" style={{ color: 'var(--sub-text-color)' }}>
          {hasFilters 
            ? t("leaves.table.noResultsDescription", "No leave requests match your current filters. Try adjusting your search criteria.")
            : t("leaves.table.noDataDescription", "You haven't submitted any leave requests yet. Click the 'New Request' button to create your first leave request.")
          }
        </p>
        
        {hasFilters && (
          <button
            onClick={() => {
              setLeaveType("all");
              setStatus("all");
              setDateFrom("");
              setDateTo("");
              setSortBy("newest");
            }}
            className="px-4 py-2 gradient-bg text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            {t("leaves.table.clearFilters", "Clear Filters")}
          </button>
        )}
      </div>
    );
  };

  // Loading state component
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-sm" style={{ color: 'var(--sub-text-color)' }}>
        {t("leaves.table.loading", "Loading leave requests...")}
      </p>
    </div>
  );

  // Error state component
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" 
           style={{ backgroundColor: 'var(--error-color)', opacity: 0.1 }}>
        <FileX className="w-8 h-8" style={{ color: 'var(--error-color)' }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
        {t("leaves.table.errorTitle", "Error Loading Data")}
      </h3>
      <p className="text-sm text-center mb-6 max-w-md" style={{ color: 'var(--sub-text-color)' }}>
        {error?.data?.message || error?.message || t("leaves.table.errorDescription", "Something went wrong while loading your leave requests. Please try again.")}
      </p>
      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="px-4 py-2 gradient-bg text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm flex items-center gap-2 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {t("leaves.table.retry", "Try Again")}
      </button>
    </div>
  );

  return (
    <div
      className="rounded-xl border shadow-sm"
      style={{
        backgroundColor: 'var(--bg-color)',
        borderColor: 'var(--border-color)'
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Filters */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--divider-color)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <SelectField
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "newest", label: t("leaves.table.sort.newest") },
                { value: "oldest", label: t("leaves.table.sort.oldest") }
              ]}
              label={t("leaves.table.sortBy")}
            />

            <SelectField
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              options={[
                { value: "all", label: t("leaves.table.leaveType.all") },
                { value: "annual", label: t("leaves.table.leaveType.annual") },
                { value: "sick", label: t("leaves.table.leaveType.sick") },
                { value: "emergency", label: t("leaves.table.leaveType.emergency") },
                { value: "unpaid", label: t("leaves.table.leaveType.unpaid") }
              ]}
              label={t("leaves.table.leaveType.label")}
            />

            <SelectField
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "all", label: t("leaves.table.status.all") },
                { value: "pending", label: t("leaves.table.status.pending") },
                { value: "approved", label: t("leaves.table.status.approved") },
                { value: "rejected", label: t("leaves.table.status.rejected") }
              ]}
              label={t("leaves.table.status.label")}
            />

            <DateField
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              label={t("leaves.table.dateFrom")}
            />

            <DateField
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              label={t("leaves.table.dateTo")}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
              {isLoading ? "..." : `${currentPageData.length} ${t("leaves.table.of")} ${filteredData.length} ${t("leaves.table.entries")}`}
            </div>
            
            {/* Refresh button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing || isLoading}
              className="p-2 rounded-lg border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)'
              }}
              title={t("leaves.table.refresh", "Refresh data")}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: 'var(--sub-text-color)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {error ? (
          renderErrorState()
        ) : isLoading ? (
          renderLoadingState()
        ) : currentPageData.length === 0 ? (
          renderEmptyState()
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--table-header-bg)' }}>
              <tr>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-header-text)' }}>
                  {t("leaves.table.columns.leaveType")}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-header-text)' }}>
                  {t("leaves.table.columns.from")}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-header-text)' }}>
                  {t("leaves.table.columns.to")}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-header-text)' }}>
                  {t("leaves.table.columns.days")}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-header-text)' }}>
                  {t("leaves.table.columns.status")}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-header-text)' }}>
                  {t("leaves.table.columns.reason")}
                </th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-header-text)' }}>
                  {t("leaves.table.columns.approver")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((record, index) => (
                <tr
                  key={record.id || record._id}
                  className="transition-colors duration-200 cursor-pointer hover:shadow-sm"
                  style={{
                    borderBottom: '1px solid var(--table-border)',
                    backgroundColor: index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-alt-bg)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--table-header-bg)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-alt-bg)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <td className={`px-6 py-4 text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--table-text)' }}>
                    {record.leaveType}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--table-text)' }}>
                    {record.startDate ? new Date(record.startDate).toLocaleDateString() : ""}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--table-text)' }}>
                    {record.endDate ? new Date(record.endDate).toLocaleDateString() : ""}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--table-text)' }}>
                    {record.days}
                  </td>
                  <td className={`px-6 py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {getStatusBadge(record.status)}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--table-text)' }}>
                    {record.reason}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--table-text)' }}>
                    {record.actionBy
                      ? `${record.actionBy}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination - Only show if there's data */}
      {!error && !isLoading && currentPageData.length > 0 && (
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}
          style={{ borderColor: 'var(--divider-color)' }}
        >
          <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
            {t("leaves.table.page")} {pagination.page} {t("leaves.table.of")} {totalPages}
            ({filteredData.length} {t("leaves.table.totalEntries")})
          </div>
          <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={pagination.page === 1}
              className="p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)'
              }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={pagination.page === totalPages}
              className="p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)'
              }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTable;

