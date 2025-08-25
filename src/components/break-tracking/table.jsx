import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const BreakHistoryTable = () => {
  const { t, i18n } = useTranslation();
  const [sortBy, setSortBy] = useState("newest");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const isArabic = i18n.language === "ar";

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedType, sortBy]);

  // Enhanced sample break history data
  const breakHistoryData = [
    {
      date: "2023-07-29",
      displayDate: "29 July 2023",
      breakType: "prayer",
      duration: "22m",
      startTime: "01:30 PM",
      endTime: "01:52 PM"
    },
    {
      date: "2023-07-29",
      displayDate: "29 July 2023",
      breakType: "lunch",
      duration: "32m",
      startTime: "12:00 PM",
      endTime: "12:32 PM"
    },
    {
      date: "2023-07-29",
      displayDate: "29 July 2023",
      breakType: "breakfast",
      duration: "25m",
      startTime: "06:00 AM",
      endTime: "06:25 AM"
    },
    {
      date: "2023-07-28",
      displayDate: "28 July 2023",
      breakType: "personal",
      duration: "18m",
      startTime: "03:15 PM",
      endTime: "03:33 PM"
    },
    {
      date: "2023-07-28",
      displayDate: "28 July 2023",
      breakType: "emergency",
      duration: "12m",
      startTime: "10:45 AM",
      endTime: "10:57 AM"
    },
    {
      date: "2023-07-27",
      displayDate: "27 July 2023",
      breakType: "prayer",
      duration: "20m",
      startTime: "01:30 PM",
      endTime: "01:50 PM"
    },
    {
      date: "2023-07-27",
      displayDate: "27 July 2023",
      breakType: "lunch",
      duration: "28m",
      startTime: "12:00 PM",
      endTime: "12:28 PM"
    },
    {
      date: "2023-07-26",
      displayDate: "26 July 2023",
      breakType: "coffee",
      duration: "15m",
      startTime: "10:30 AM",
      endTime: "10:45 AM"
    }
  ];

  const sortOptions = [
    { value: "newest", label: t("breakHistoryTable.sort.newest") },
    { value: "oldest", label: t("breakHistoryTable.sort.oldest") }
  ];

  const dateOptions = [
    { value: "all", label: t("breakHistoryTable.allDates") },
    { value: "2023-07-29", label: "29 July 2023" },
    { value: "2023-07-28", label: "28 July 2023" },
    { value: "2023-07-27", label: "27 July 2023" },
    { value: "2023-07-26", label: "26 July 2023" }
  ];

  const typeOptions = [
    { value: "all", label: t("breakHistoryTable.allTypes") },
    { value: "prayer", label: t("breakTime.reasons.prayer") },
    { value: "lunch", label: t("breakTime.reasons.lunch") },
    { value: "breakfast", label: t("breakTime.reasons.breakfast") },
    { value: "personal", label: t("breakTime.reasons.personal") },
    { value: "emergency", label: t("breakTime.reasons.emergency") },
    { value: "coffee", label: t("breakTime.reasons.coffee") }
  ];

  // Filter and sort data
  let filteredData = breakHistoryData.filter(record => {
    if (selectedType !== "all" && record.breakType !== selectedType) {
      return false;
    }
    if (selectedDate !== "all" && record.date !== selectedDate) {
      return false;
    }
    return true;
  });

  // Sort data
  filteredData = filteredData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (sortBy === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

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
    <div
      className="rounded-xl border shadow-sm"
      style={{
        backgroundColor: 'var(--bg-color)',
        borderColor: 'var(--border-color)'
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Table Controls */}
      <div
        className="p-6 border-b"
        style={{ borderColor: 'var(--divider-color)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-5">
            <SelectField
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
              label={t("breakHistoryTable.sortBy")}
            />

            <SelectField
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              options={dateOptions}
              label={t("breakHistoryTable.date")}
            />

            <SelectField
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={typeOptions}
              label={t("breakHistoryTable.type")}
            />
          </div>

          <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
            {currentPageData.length} {t("breakHistoryTable.of")} {filteredData.length} {t("breakHistoryTable.entries")}
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
                {t("breakHistoryTable.columns.breakType")}
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
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((record, index) => (
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
                  {record.displayDate}
                </td>
                <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium inline-block"
                    style={{
                      backgroundColor: 'var(--tag-bg)',
                      color: 'var(--tag-text)',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}
                  >
                    {t(`breakTime.reasons.${record.breakType}`)}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--table-text)' }}>
                  {record.duration}
                </td>
                <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--sub-text-color)' }}>
                  {record.startTime}
                </td>
                <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--sub-text-color)' }}>
                  {record.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className={`px-6 py-4 border-t flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}
        style={{ borderColor: 'var(--divider-color)' }}
      >
        <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
          {t("breakHistoryTable.page")} {currentPage} {t("breakHistoryTable.of")} {totalPages} ({filteredData.length} {t("breakHistoryTable.totalEntries")})
        </div>
        <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)'
            }}
          >
            {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)'
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
