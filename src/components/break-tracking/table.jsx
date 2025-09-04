import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetBreakStatsQuery } from "../../services/apis/BreakApi";
import { useBreakUpdate } from "../../contexts/BreakUpdateContext"

const BreakHistoryTable = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [sortBy, setSortBy] = useState("newest");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { lastBreakUpdate } = useBreakUpdate()
  // Fetch data from API with filters
  const { data: statsData, isLoading, refetch } = useGetBreakStatsQuery(
    { page: currentPage, limit: 4, sortBy, date: selectedDate, type: selectedType }
  )

  useEffect(() => {
    refetch()
  }, [lastBreakUpdate])

  const breaks = statsData?.breaks || [];
  const pagination = statsData?.pagination || { page: 1, limit: 4, total: 0, totalPages: 1 };
  const availableFilters = statsData?.availableFilters || { dates: [], types: [] };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedType, sortBy]);

  // Format time
  const formatLocalTime = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Table filter fields
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
                { value: "newest", label: t("breakHistoryTable.sort.newest") },
                { value: "oldest", label: t("breakHistoryTable.sort.oldest") }
              ]}
              label={t("breakHistoryTable.sortBy")}
            />

            <SelectField
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              options={[
                { value: "", label: t("breakHistoryTable.date.all") },
                ...availableFilters.dates.map(date => ({ value: date, label: date }))
              ]}
              label={t("breakHistoryTable.date.label")}
            />

            <SelectField
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { value: "", label: t("breakHistoryTable.type.all") },
                ...availableFilters.types.map(type => ({
                  value: type,
                  label: t(`breakTime.reasons.${type}`, type)
                }))
              ]}
              label={t("breakHistoryTable.type.label")}
            />
          </div>

          <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
            {isLoading ? "..." : `${breaks.length} ${t("breakHistoryTable.of")} ${pagination.total || 0} ${t("breakHistoryTable.entries")}`}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--table-header-bg)' }}>
            <tr>
              <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                style={{ color: 'var(--table-header-text)' }}>
                {t("breakHistoryTable.columns.date")}
              </th>
              <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                style={{ color: 'var(--table-header-text)' }}>
                {t("breakHistoryTable.columns.type")}
              </th>
              <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                style={{ color: 'var(--table-header-text)' }}>
                {t("breakHistoryTable.columns.duration")}
              </th>
              <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                style={{ color: 'var(--table-header-text)' }}>
                {t("breakHistoryTable.columns.startTime")}
              </th>
              <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                style={{ color: 'var(--table-header-text)' }}>
                {t("breakHistoryTable.columns.endTime")}
              </th>
              <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                style={{ color: 'var(--table-header-text)' }}>
                {t("breakHistoryTable.columns.status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">{t("breakHistoryTable.loading")}</td>
              </tr>
            ) : breaks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">{t("breakHistoryTable.noData")}</td>
              </tr>
            ) : (
              breaks.map((record, index) => (
                <tr
                  key={index}
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
                    {record.date}
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: '#75C8CF' }}>
                    {t(`breakTime.reasons.${record.breakType}`, record.breakType)}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--sub-text-color)' }}>
                    {record.duration}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--sub-text-color)' }}>
                    {formatLocalTime(record.startTime)}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--sub-text-color)' }}>
                    {formatLocalTime(record.endTime)}
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold ${isArabic ? 'text-right' : 'text-left'}`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.exceeded
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                      }`}>
                      {record.exceeded ? t("breakHistoryTable.status.exceeded") : t("breakHistoryTable.status.normal")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className={`px-6 py-4 border-t flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}
        style={{ borderColor: 'var(--divider-color)' }}
      >
        <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
          {t("breakHistoryTable.page")} {pagination.page || 1} {t("breakHistoryTable.of")} {pagination.totalPages || 1}
          ({pagination.total || 0} {t("breakHistoryTable.totalEntries")})
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
            {isArabic ? <ChevronRight className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} /> : <ChevronLeft className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} />}
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(pagination.totalPages || 1, currentPage + 1))}
            disabled={pagination.page === (pagination.totalPages || 1)}
            className="p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)'
            }}
          >
            {isArabic ? <ChevronLeft className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} /> : <ChevronRight className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakHistoryTable;
