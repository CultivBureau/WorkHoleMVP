import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const BreakHistoryTable = () => {
  const { t, i18n } = useTranslation();
  const [sortBy, setSortBy] = useState("newest");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedType]);

  // Enhanced sample break history data with more realistic entries
  const breakHistoryData = [
    {
      date: "29 July 2023",
      breakType: "Prayer",
      duration: "22m",
      startTime: "01:30 PM",
      endTime: "01:52 PM"
    },
    {
      date: "29 July 2023",
      breakType: "Lunch",
      duration: "32m",
      startTime: "12:00 PM",
      endTime: "12:32 PM"
    },
    {
      date: "29 July 2023",
      breakType: "Break Fast",
      duration: "25m",
      startTime: "06:00 AM",
      endTime: "06:25 AM"
    },
    {
      date: "28 July 2023",
      breakType: "General",
      duration: "18m",
      startTime: "03:15 PM",
      endTime: "03:33 PM"
    },
    {
      date: "28 July 2023",
      breakType: "Emergency",
      duration: "12m",
      startTime: "10:45 AM",
      endTime: "10:57 AM"
    },
    {
      date: "27 July 2023",
      breakType: "Prayer",
      duration: "20m",
      startTime: "01:30 PM",
      endTime: "01:50 PM"
    },
    {
      date: "27 July 2023",
      breakType: "Lunch",
      duration: "28m",
      startTime: "12:00 PM",
      endTime: "12:28 PM"
    }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" }
  ];

  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "29/07/2023", label: "29 July 2023" },
    { value: "28/07/2023", label: "28 July 2023" },
    { value: "27/07/2023", label: "27 July 2023" }
  ];

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "prayer", label: "Prayer" },
    { value: "lunch", label: "Lunch" },
    { value: "breakfast", label: "Break Fast" },
    { value: "general", label: "General" },
    { value: "emergency", label: "Emergency" }
  ];

  // Filter data based on selected filters
  const filteredData = breakHistoryData.filter(record => {
    if (selectedType !== "all" && record.breakType.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }
    if (selectedDate !== "all") {
      // Simple date filtering - in a real app you'd want more sophisticated date handling
      return record.date.includes(selectedDate.split('/')[0]);
    }
    return true;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Table Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Date</span>
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type</span>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            {currentPageData.length} of {filteredData.length} entries
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Break Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{record.breakType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.duration}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.startTime}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {currentPage} of {totalPages} page ({filteredData.length} total entries)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakHistoryTable;
