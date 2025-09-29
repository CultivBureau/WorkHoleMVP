import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLang } from '../../../../contexts/LangContext';

// Sample employee data matching the image (keeping only first 8 for better fit)
const employeeData = [
  {
    id: 1,
    name: "Leasie Watson",
    designation: "Team Lead - Design",
    type: "Office",
    checkInTime: "09:27 AM",
    status: "On Time",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
  {
    id: 2,
    name: "Darlene Robertson",
    designation: "Web Designer",
    type: "Office",
    checkInTime: "10:15 AM",
    status: "Late",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
  {
    id: 3,
    name: "Jacob Jones",
    designation: "Medical Assistant",
    type: "Remote",
    checkInTime: "10:24 AM",
    status: "Late",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
  {
    id: 4,
    name: "Kathryn Murphy",
    designation: "Marketing Coordinator",
    type: "Office",
    checkInTime: "09:10 AM",
    status: "On Time",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
  {
    id: 5,
    name: "Leslie Alexander",
    designation: "Data Analyst",
    type: "Office",
    checkInTime: "09:15 AM",
    status: "On Time",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
  {
    id: 6,
    name: "Ronald Richards",
    designation: "Python Developer",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
  {
    id: 7,
    name: "Guy Hawkins",
    designation: "UI/UX Design",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
  {
    id: 8,
    name: "Albert Flores",
    designation: "React JS",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time",
    avatar: "/assets/AdminDashboard/avatar.svg",
  },
];

const AttendanceTable = () => {
  const { t } = useTranslation();
  const { isRtl } = useLang();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [designationFilter, setDesignationFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Status');

  return (
    <div className="w-full p-2 sm:p-4">
      {/* Header */}
      <h1 className="text-lg sm:text-xl text-start font-semibold text-[var(--text-color)] mb-3 sm:mb-4">
        {t("adminDashboard.table.attendanceOverview", "Attendance Overview")}
      </h1>

      {/* Filters Section */}
      <div className="flex flex-col gap-3 shadow-lg border border-[var(--border-color)] rounded-[22px] p-3 mb-4">
        {/* Search Input - Full width on mobile */}
        <div className="relative w-[68.5%] max-[1200px]:w-full">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[var(--sub-text-color)] w-3.5 h-3.5" />
          <input
            type="text"
            placeholder={t("adminDashboard.table.search", "Search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters and Button Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter Dropdowns Container */}
          <div className="flex flex-col min-[480px]:flex-row flex-wrap gap-2 min-[480px]:gap-3 w-full sm:flex-1">
            {/* Designation Filter */}
            <div className="flex flex-col min-[320px]:flex-row min-[320px]:items-center gap-1 min-[320px]:gap-1.5 flex-1 min-[480px]:flex-none min-w-0">
              <span className="text-xs text-[var(--sub-text-color)] whitespace-nowrap min-[320px]:min-w-[70px] min-[480px]:min-w-[60px]">
                {t("adminDashboard.table.designation", "Designation")}
              </span>
              <div className="relative flex-1 min-[480px]:flex-none min-w-0">
                <select
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                  className="w-full min-[480px]:w-[100px] sm:w-[120px] h-[32px] appearance-none bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">{t("adminDashboard.table.all", "All")}</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--sub-text-color)] pointer-events-none" />
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col min-[320px]:flex-row min-[320px]:items-center gap-1 min-[320px]:gap-1.5 flex-1 min-[480px]:flex-none min-w-0">
              <span className="text-xs text-[var(--sub-text-color)] whitespace-nowrap min-[320px]:min-w-[50px] min-[480px]:min-w-[45px]">
                {t("adminDashboard.table.location", "Location")}
              </span>
              <div className="relative flex-1 min-[480px]:flex-none min-w-0">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full min-[480px]:w-[80px] sm:w-[100px] h-[32px] appearance-none bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">{t("adminDashboard.table.all", "All")}</option>
                  <option value="Office">{t("adminDashboard.table.office", "Office")}</option>
                  <option value="Remote">{t("adminDashboard.table.remote", "Remote")}</option>
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--sub-text-color)] pointer-events-none" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col min-[320px]:flex-row min-[320px]:items-center gap-1 min-[320px]:gap-1.5 flex-1 min-[480px]:flex-none min-w-0">
              <span className="text-xs text-[var(--sub-text-color)] whitespace-nowrap min-[320px]:min-w-[40px] min-[480px]:min-w-[35px]">
                {t("adminDashboard.table.status", "Status")}
              </span>
              <div className="relative flex-1 min-[480px]:flex-none min-w-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full min-[480px]:w-[90px] sm:w-[110px] h-[32px] appearance-none bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All Status">{t("adminDashboard.table.allStatus", "All Status")}</option>
                  <option value="On Time">{t("adminDashboard.table.onTime", "On Time")}</option>
                  <option value="Late">{t("adminDashboard.table.late", "Late")}</option>
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--sub-text-color)] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* View All Button */}
          <button className="text-xs text-[var(--accent-color)] hover:text-[var(--accent-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 whitespace-nowrap hover:underline w-full min-[480px]:w-auto sm:flex-shrink-0">
            {t("adminDashboard.table.viewAll", "View All")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg-color)]">
                <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">
                  {t("adminDashboard.table.employeeName", "Employee Name")}
                </th>
                <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">
                  {t("adminDashboard.table.designation", "Designation")}
                </th>
                <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">
                  {t("adminDashboard.table.type", "Type")}
                </th>
                <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">
                  {t("adminDashboard.table.checkInTime", "Check In Time")}
                </th>
                <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">
                  {t("adminDashboard.table.status", "Status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee, index) => (
                <tr 
                  key={employee.id} 
                  className={`hover:bg-[var(--hover-color)] transition-colors ${index !== employeeData.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                        {employee.avatar ? (
                          <img 
                            src={employee.avatar} 
                            alt={employee.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[var(--sub-text-color)] text-xs font-medium">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-[var(--text-color)] text-sm">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-color)] text-sm">{employee.designation}</td>
                  <td className="py-3 px-4 text-[var(--text-color)] text-sm">{employee.type}</td>
                  <td className="py-3 px-4 text-[var(--text-color)] text-sm">{employee.checkInTime}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-center rounded-full text-xs font-medium ${
                        employee.status === "On Time"
                          ? "bg-[#3FC28A1A] text-[var(--success-color)]"
                          : "bg-[#F45B691A] text-[var(--error-color)]"
                      }`}
                    >
                      {employee.status === "On Time" 
                        ? t("adminDashboard.table.onTime", "On Time")
                        : t("adminDashboard.table.late", "Late")
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden text-start">
          {employeeData.map((employee, index) => (
            <div 
              key={employee.id} 
              className={`p-4 hover:bg-[var(--hover-color)] transition-colors ${index !== employeeData.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                  {employee.avatar ? (
                    <img 
                      src={employee.avatar} 
                      alt={employee.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[var(--sub-text-color)] text-xs font-medium">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[var(--text-color)] text-sm">{employee.name}</h3>
                  <p className="text-[var(--sub-text-color)] text-xs">{employee.designation}</p>
                </div>
                <span
                  className={`inline-flex px-2.5 py-1 text-center rounded-full text-xs font-medium ${
                    employee.status === "On Time"
                      ? "bg-[#3FC28A1A] text-[var(--success-color)]"
                      : "bg-[#F45B691A] text-[var(--error-color)]"
                  }`}
                >
                  {employee.status === "On Time" 
                    ? t("adminDashboard.table.onTime", "On Time")
                    : t("adminDashboard.table.late", "Late")
                  }
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[var(--sub-text-color)]">{t("adminDashboard.table.type", "Type")}: </span>
                  <span className="text-[var(--text-color)]">{employee.type}</span>
                </div>
                <div>
                  <span className="text-[var(--sub-text-color)]">{t("adminDashboard.table.checkInTime", "Check In")}: </span>
                  <span className="text-[var(--text-color)]">{employee.checkInTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
