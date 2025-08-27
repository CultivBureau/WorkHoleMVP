import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetBreakStatsQuery } from "../../services/apis/BreakApi";

const BreakHistoryTable = () => {
  const { t, i18n } = useTranslation();
  const [sortBy, setSortBy] = useState("newest");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API with filters
  const { data: statsData, isLoading } = useGetBreakStatsQuery({
    page: currentPage,
    limit: 4,
    sortBy,
    date: selectedDate,
    type: selectedType
  });

  const breaks = statsData?.breaks || [];
  const pagination = statsData?.pagination || {};
  const availableFilters = statsData?.availableFilters || { dates: [], types: [] };

  const sortOptions = [
    { value: "newest", label: t("breakHistoryTable.sort.newest") },
    { value: "oldest", label: t("breakHistoryTable.sort.oldest") }
  ];

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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-2xl border shadow-lg backdrop-blur-sm p-6 animate-pulse"
        style={{
          background: "linear-gradient(135deg, var(--bg-color), rgba(255,255,255,0.02))",
          borderColor: "var(--border-color)"
        }}>
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const SelectField = ({ value, onChange, options, label }) => (
    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
      <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--sub-text-color)' }}>
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="border rounded-2xl px-4 py-2 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[130px] font-medium"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            focusRingColor: 'var(--accent-color)',
            paddingRight: isArabic ? '16px' : '35px',
            paddingLeft: isArabic ? '35px' : '16px',
            direction: isArabic ? 'rtl' : 'ltr',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            height: '36px'
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none ${isArabic ? 'left-3' : 'right-3'
            }`}
          style={{ color: 'var(--sub-text-color)' }}
        />
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
      style={{
        background: "linear-gradient(135deg, var(--bg-color), rgba(255,255,255,0.02))",
        borderColor: "var(--border-color)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
      }}>
      {/* Table Controls */}
      <div className="p-6 border-b border-opacity-20" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-full px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 pr-8 transition-all duration-200"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--bg-color)",
                  color: "var(--text-color)",
                  focusRingColor: "#75C8CF"
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--sub-text-color)" }} />
            </div>
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>Date</span>
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-full px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 pr-8 transition-all duration-200"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--bg-color)",
                  color: "var(--text-color)",
                  focusRingColor: "#75C8CF"
                }}
              >
                <option value="">All Dates</option>
                {availableFilters.dates.map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--sub-text-color)" }} />
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>Type</span>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-full px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 pr-8 transition-all duration-200"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--bg-color)",
                  color: "var(--text-color)",
                  focusRingColor: "#75C8CF"
                }}
              >
                <option value="">All Types</option>
                {availableFilters.types.map(type => (
                  <option key={type} value={type}>
                    {t(`breakTime.reasons.${type}`, type)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--sub-text-color)" }} />
            </div>
          </div>
          
          <div className="ml-auto text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
            {breaks.length} of {pagination.total} entries
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--bg-color)" }}>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--sub-text-color)" }}>
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--sub-text-color)" }}>
                Break Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--sub-text-color)" }}>
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--sub-text-color)" }}>
                Start Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--sub-text-color)" }}>
                End Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--sub-text-color)" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-opacity-20" style={{ divideColor: "var(--border-color)" }}>
            {breaks.map((record, index) => (
              <tr key={index} className="transition-all duration-200"
                style={{ backgroundColor: "transparent" }}>
                <td className="px-6 py-4 text-sm font-medium"
                  style={{ color: "var(--text-color)" }}>
                  {record.date}
                </td>
                <td className="px-6 py-4 text-sm font-semibold"
                  style={{ color: "#75C8CF" }}>
                  {t(`breakTime.reasons.${record.breakType}`, record.breakType)}
                </td>
                <td className="px-6 py-4 text-sm"
                  style={{ color: "var(--sub-text-color)" }}>
                  {record.duration}
                </td>
                <td className="px-6 py-4 text-sm"
                  style={{ color: "var(--sub-text-color)" }}>
                  {formatLocalTime(record.startTime)}
                </td>
                <td className="px-6 py-4 text-sm"
                  style={{ color: "var(--sub-text-color)" }}>
                  {formatLocalTime(record.endTime)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    record.exceeded
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {record.exceeded ? "Exceeded" : "Normal"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-opacity-20 flex items-center justify-between"
        style={{ borderColor: "var(--border-color)" }}>
        <div className="text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
          Page {pagination.page || 1} of {pagination.totalPages || 1}
          ({pagination.total || 0} total entries)
        </div>
        <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            style={{
              borderColor: "var(--border-color)",
              background: "var(--container-color)",
              color: "var(--text-color)"
            }}
          >
            {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages || 1)].map((_, i) => {
              const pageNum = i + 1;
              if (pageNum === currentPage) {
                return (
                  <span key={pageNum}
                    className="px-3 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: "#75C8CF" }}>
                    {pageNum}
                  </span>
                );
              }
              return (
                <button key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: "var(--container-color)",
                    color: "var(--sub-text-color)"
                  }}>
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(pagination.totalPages || 1, currentPage + 1))}
            disabled={currentPage === (pagination.totalPages || 1)}
            className="p-2 rounded-xl border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            style={{
              borderColor: "var(--border-color)",
              background: "var(--container-color)",
              color: "var(--text-color)"
            }}
          >
            {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakHistoryTable;
