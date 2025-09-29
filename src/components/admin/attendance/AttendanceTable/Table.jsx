"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next";
import { useLang } from "../../../../contexts/LangContext";

// Sample employee data matching the image
const employeeData = [
  {
    id: 1,
    name: "Darlene Robertson",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "10h 2m",
    status: "Present",
    location: "Work from office",
  },
  {
    id: 2,
    name: "Cody Fisher",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "00:00 AM",
    checkOut: "00:00 PM",
    workHours: "0m",
    status: "Absent",
    location: "------",
  },
  {
    id: 3,
    name: "Savannah Nguyen",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "8h 30m",
    status: "Late arrival",
    location: "Work from office",
  },
  {
    id: 4,
    name: "Marvin McKinney",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "10h 5m",
    status: "Present",
    location: "Work from home",
  },
  {
    id: 5,
    name: "Jacob Jones",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "10h 2m",
    status: "Late arrival",
    location: "Work from office",
  },
  {
    id: 6,
    name: "Kristin Watson",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "00:00 AM",
    checkOut: "00:00 PM",
    workHours: "0m",
    status: "Absent",
    location: "------",
  },
  {
    id: 7,
    name: "Devon Lane",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "10h 2m",
    status: "Present",
    location: "Work from home",
  },
  {
    id: 8,
    name: "Arlene McCoy",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "10h 2m",
    status: "Present",
    location: "Work from home",
  },
  {
    id: 9,
    name: "Kristin Watson",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "10h 2m",
    status: "Present",
    location: "Work from home",
  },
  {
    id: 10,
    name: "Darlene Robertson",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    workHours: "10h 2m",
    status: "Present",
    location: "Work from home",
  },
]

const AttendanceTable = () => {
  const { t } = useTranslation();
  const { isRtl } = useLang();
  
  const [sortBy, setSortBy] = useState(t("adminAttendance.table.sort.newestFirst", "Newest First"))
  const [location, setLocation] = useState(t("adminAttendance.table.location.all", "All"))
  const [status, setStatus] = useState(t("adminAttendance.table.status.allStatus", "All Status"))
  const [dateFrom, setDateFrom] = useState("09/09/2025")
  const [dateTo, setDateTo] = useState("09/09/2025")

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-block border";
    switch (status) {
      case "Present":
        return <span className={`${baseClasses} bg-[var(--approved-leave-box-bg)] text-[var(--success-color)] border-[var(--success-color)]`}>
          {t("adminAttendance.table.status.present", "Present")}
        </span>
      case "Absent":
        return <span className={`${baseClasses} bg-[var(--rejected-leave-box-bg)] text-[var(--error-color)] border-[var(--error-color)]`}>
          {t("adminAttendance.table.status.absent", "Absent")}
        </span>
      case "Late arrival":
        return <span className={`${baseClasses} bg-[var(--pending-leave-box-bg)] text-[var(--warning-color)] border-[var(--warning-color)]`}>
          {t("adminAttendance.table.status.lateArrival", "Late arrival")}
        </span>
      default:
        return <span className={`${baseClasses} bg-[var(--container-color)] text-[var(--sub-text-color)] border-[var(--border-color)]`}>{status}</span>
    }
  }

  const getLocationBadge = (location) => {
    if (location === "------") {
      return <span className="text-[var(--sub-text-color-2)] text-sm">------</span>
    }
    const isOffice = location === "Work from office"
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-block border"
    return (
      <span
        className={`${baseClasses} ${
          isOffice 
            ? "bg-[var(--available-leave-box-bg)] text-[var(--accent-color)] border-[var(--accent-color)]" 
            : "bg-[var(--card-bg)] text-[var(--sub-text-color)] border-[var(--border-color)]"
        }`}
      >
        {isOffice 
          ? t("adminAttendance.table.location.workFromOffice", "Work from office")
          : t("adminAttendance.table.location.workFromHome", "Work from home")
        }
      </span>
    )
  }

  const getTimeStyle = (status, time) => {
    if (status === "Absent" && time.includes("00:00")) {
      return "text-[var(--error-color)] text-sm"
    }
    return "text-[var(--text-color)] text-sm"
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)]">
      {/* Header with filters */}
      <div className="px-6 py-4 border-b flex justify-center items-center bg-[var(--bg-color)]">
        <div className="flex bg-[var(--bg-color)] p-4 w-[98%] h-max shadow-xl rounded-3xl border border-[var(--border-color)] flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.sortBy", "Sort By")}
              </span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value={t("adminAttendance.table.sort.newestFirst", "Newest First")}>
                  {t("adminAttendance.table.sort.newestFirst", "Newest First")}
                </option>
                <option value={t("adminAttendance.table.sort.oldestFirst", "Oldest First")}>
                  {t("adminAttendance.table.sort.oldestFirst", "Oldest First")}
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.location.title", "Location")}
              </span>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value={t("adminAttendance.table.location.all", "All")}>
                  {t("adminAttendance.table.location.all", "All")}
                </option>
                <option value={t("adminAttendance.table.location.office", "Office")}>
                  {t("adminAttendance.table.location.office", "Office")}
                </option>
                <option value={t("adminAttendance.table.location.home", "Home")}>
                  {t("adminAttendance.table.location.home", "Home")}
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.status.title", "Status")}
              </span>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value={t("adminAttendance.table.status.allStatus", "All Status")}>
                  {t("adminAttendance.table.status.allStatus", "All Status")}
                </option>
                <option value={t("adminAttendance.table.status.present", "Present")}>
                  {t("adminAttendance.table.status.present", "Present")}
                </option>
                <option value={t("adminAttendance.table.status.absent", "Absent")}>
                  {t("adminAttendance.table.status.absent", "Absent")}
                </option>
                <option value={t("adminAttendance.table.status.lateArrival", "Late arrival")}>
                  {t("adminAttendance.table.status.lateArrival", "Late arrival")}
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.dateFrom", "Date from")}
              </span>
              <select 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value="09/09/2025">09/09/2025</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.dateTo", "Date To")}
              </span>
              <select 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value="09/09/2025">09/09/2025</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--sub-text-color)]">
              {t("adminAttendance.table.pageOf", "5 of 18 page")}
            </span>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--table-header-bg)]">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                {t("adminAttendance.table.columns.employeeName", "Employees Name")}
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                {t("adminAttendance.table.columns.date", "Date")}
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-1 cursor-pointer">
                  {t("adminAttendance.table.columns.checkIn", "Check-in")}
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-1 cursor-pointer">
                  {t("adminAttendance.table.columns.checkOut", "Check-out")}
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-1 cursor-pointer">
                  {t("adminAttendance.table.columns.workHours", "Work hours")}
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-1 cursor-pointer">
                  {t("adminAttendance.table.columns.status", "Status")}
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-1 cursor-pointer">
                  {t("adminAttendance.table.columns.location", "Location")}
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--table-bg)]">
            {employeeData.map((employee, index) => (
              <tr key={employee.id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-color)] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--container-color)] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[var(--border-color)]">
                      {employee.avatar ? (
                        <img 
                          src={employee.avatar} 
                          alt={employee.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-[var(--sub-text-color)]">
                          {getInitials(employee.name)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-[var(--text-color)] text-sm">{employee.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500 text-sm">{employee.date}</td>
                <td className={`py-4 px-6 ${getTimeStyle(employee.status, employee.checkIn)}`}>
                  {employee.checkIn}
                </td>
                <td className={`py-4 px-6 ${getTimeStyle(employee.status, employee.checkOut)}`}>
                  {employee.checkOut}
                </td>
                <td className="py-4 px-6 text-gray-900 text-sm font-medium">{employee.workHours}</td>
                <td className="py-4 px-6">{getStatusBadge(employee.status)}</td>
                <td className="py-4 px-6">{getLocationBadge(employee.location)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceTable
