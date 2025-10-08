"use client"

import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next";
import { useLang } from "../../../../contexts/LangContext";
import { ChevronDown, ChevronUp } from "lucide-react";

// Sample employee data matching the image
const employeeData = [
  {
    id: 1,
    name: "Darlene Robertson",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    dateSort: new Date("2023-07-29"),
    checkIn: "09:00 AM",
    checkInSort: "09:00",
    checkOut: "05:00 PM",
    checkOutSort: "17:00",
    workHours: "10h 2m",
    workHoursSort: 602, // in minutes
    status: "Present",
    location: "Work from office",
  },
  {
    id: 2,
    name: "Cody Fisher",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "29 July 2023",
    dateSort: new Date("2023-07-29"),
    checkIn: "00:00 AM",
    checkInSort: "00:00",
    checkOut: "00:00 PM",
    checkOutSort: "00:00",
    workHours: "0m",
    workHoursSort: 0,
    status: "Absent",
    location: "------",
  },
  {
    id: 3,
    name: "Savannah Nguyen",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "28 July 2023",
    dateSort: new Date("2023-07-28"),
    checkIn: "09:30 AM",
    checkInSort: "09:30",
    checkOut: "05:00 PM",
    checkOutSort: "17:00",
    workHours: "8h 30m",
    workHoursSort: 510,
    status: "Late arrival",
    location: "Work from office",
  },
  {
    id: 4,
    name: "Marvin McKinney",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "28 July 2023",
    dateSort: new Date("2023-07-28"),
    checkIn: "08:55 AM",
    checkInSort: "08:55",
    checkOut: "06:00 PM",
    checkOutSort: "18:00",
    workHours: "10h 5m",
    workHoursSort: 605,
    status: "Present",
    location: "Work from home",
  },
  {
    id: 5,
    name: "Jacob Jones",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "27 July 2023",
    dateSort: new Date("2023-07-27"),
    checkIn: "09:15 AM",
    checkInSort: "09:15",
    checkOut: "05:00 PM",
    checkOutSort: "17:00",
    workHours: "10h 2m",
    workHoursSort: 602,
    status: "Late arrival",
    location: "Work from office",
  },
  {
    id: 6,
    name: "Kristin Watson",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "27 July 2023",
    dateSort: new Date("2023-07-27"),
    checkIn: "00:00 AM",
    checkInSort: "00:00",
    checkOut: "00:00 PM",
    checkOutSort: "00:00",
    workHours: "0m",
    workHoursSort: 0,
    status: "Absent",
    location: "------",
  },
  {
    id: 7,
    name: "Devon Lane",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "26 July 2023",
    dateSort: new Date("2023-07-26"),
    checkIn: "08:45 AM",
    checkInSort: "08:45",
    checkOut: "05:30 PM",
    checkOutSort: "17:30",
    workHours: "10h 2m",
    workHoursSort: 602,
    status: "Present",
    location: "Work from home",
  },
  {
    id: 8,
    name: "Arlene McCoy",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "26 July 2023",
    dateSort: new Date("2023-07-26"),
    checkIn: "09:10 AM",
    checkInSort: "09:10",
    checkOut: "05:15 PM",
    checkOutSort: "17:15",
    workHours: "10h 2m",
    workHoursSort: 602,
    status: "Present",
    location: "Work from home",
  },
  {
    id: 9,
    name: "Eleanor Pena",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "25 July 2023",
    dateSort: new Date("2023-07-25"),
    checkIn: "09:00 AM",
    checkInSort: "09:00",
    checkOut: "05:00 PM",
    checkOutSort: "17:00",
    workHours: "10h 2m",
    workHoursSort: 602,
    status: "Present",
    location: "Work from home",
  },
  {
    id: 10,
    name: "Cameron Williamson",
    avatar: "/assets/AdminDashboard/avatar.svg",
    date: "25 July 2023",
    dateSort: new Date("2023-07-25"),
    checkIn: "09:25 AM",
    checkInSort: "09:25",
    checkOut: "05:00 PM",
    checkOutSort: "17:00",
    workHours: "9h 35m",
    workHoursSort: 575,
    status: "Late arrival",
    location: "Work from office",
  },
]

const AttendanceTable = () => {
  const { t } = useTranslation();
  const { isRtl } = useLang();

  // Filter states
  const [sortBy, setSortBy] = useState("newest")
  const [locationFilter, setLocationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFromFilter, setDateFromFilter] = useState("")
  const [dateToFilter, setDateToFilter] = useState("")

  // Table sorting states
  const [tableSortColumn, setTableSortColumn] = useState(null)
  const [tableSortDirection, setTableSortDirection] = useState('asc')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Handle table column sorting
  const handleTableSort = (column) => {
    if (tableSortColumn === column) {
      setTableSortDirection(tableSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setTableSortColumn(column)
      setTableSortDirection('asc')
    }
  }

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...employeeData]

    // Apply filters
    if (statusFilter !== "all") {
      filtered = filtered.filter(employee => {
        if (statusFilter === "present") return employee.status === "Present"
        if (statusFilter === "absent") return employee.status === "Absent"
        if (statusFilter === "late") return employee.status === "Late arrival"
        return true
      })
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(employee => {
        if (locationFilter === "office") return employee.location === "Work from office"
        if (locationFilter === "home") return employee.location === "Work from home"
        return true
      })
    }

    // Apply date range filter
    if (dateFromFilter || dateToFilter) {
      filtered = filtered.filter(employee => {
        const employeeDate = employee.dateSort
        let isInRange = true

        if (dateFromFilter) {
          const fromDate = new Date(dateFromFilter)
          isInRange = isInRange && employeeDate >= fromDate
        }

        if (dateToFilter) {
          const toDate = new Date(dateToFilter)
          // Set to end of day for inclusive comparison
          toDate.setHours(23, 59, 59, 999)
          isInRange = isInRange && employeeDate <= toDate
        }

        return isInRange
      })
    }

    // Apply header sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => b.dateSort - a.dateSort)
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.dateSort - b.dateSort)
    }

    // Apply table column sort
    if (tableSortColumn) {
      filtered.sort((a, b) => {
        let aVal, bVal

        switch (tableSortColumn) {
          case 'name':
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          case 'date':
            aVal = a.dateSort
            bVal = b.dateSort
            break
          case 'checkIn':
            aVal = a.checkInSort
            bVal = b.checkInSort
            break
          case 'checkOut':
            aVal = a.checkOutSort
            bVal = b.checkOutSort
            break
          case 'workHours':
            aVal = a.workHoursSort
            bVal = b.workHoursSort
            break
          case 'status':
            aVal = a.status.toLowerCase()
            bVal = b.status.toLowerCase()
            break
          case 'location':
            aVal = a.location.toLowerCase()
            bVal = b.location.toLowerCase()
            break
          default:
            return 0
        }

        if (tableSortDirection === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
        }
      })
    }

    return filtered
  }, [sortBy, locationFilter, statusFilter, dateFromFilter, dateToFilter, tableSortColumn, tableSortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  // Reset current page when filters change
  useState(() => {
    setCurrentPage(1)
  }, [sortBy, locationFilter, statusFilter, dateFromFilter, dateToFilter])

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
        className={`${baseClasses} ${isOffice
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

  const getSortIcon = (column) => {
    if (tableSortColumn !== column) {
      return <ChevronDown className="h-3 w-3 text-gray-400" />
    }
    return tableSortDirection === 'asc'
      ? <ChevronUp className="h-3 w-3 text-[var(--accent-color)]" />
      : <ChevronDown className="h-3 w-3 text-[var(--accent-color)]" />
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
                <option value="newest">
                  {t("adminAttendance.table.sort.newestFirst", "Newest First")}
                </option>
                <option value="oldest">
                  {t("adminAttendance.table.sort.oldestFirst", "Oldest First")}
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.location.title", "Location")}
              </span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value="all">
                  {t("adminAttendance.table.location.all", "All")}
                </option>
                <option value="office">
                  {t("adminAttendance.table.location.office", "Office")}
                </option>
                <option value="home">
                  {t("adminAttendance.table.location.home", "Home")}
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.status.title", "Status")}
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value="all">
                  {t("adminAttendance.table.status.allStatus", "All Status")}
                </option>
                <option value="present">
                  {t("adminAttendance.table.status.present", "Present")}
                </option>
                <option value="absent">
                  {t("adminAttendance.table.status.absent", "Absent")}
                </option>
                <option value="late">
                  {t("adminAttendance.table.status.lateArrival", "Late arrival")}
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.dateFrom", "Date from")}
              </span>
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                placeholder="Select start date"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-[var(--sub-text-color)]">
                {t("adminAttendance.table.dateTo", "Date To")}
              </span>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                placeholder="Select end date"
                min={dateFromFilter} // Prevents selecting end date before start date
              />
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-[var(--sub-text-color)]">
              {t("adminAttendance.table.pageOf", `${currentPage} of ${totalPages} page`)}
            </span>
            <div className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M15 19l-7-7 7-7"} />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M9 5l7 7-7 7" : "M9 5l7 7-7 7"} />
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
              <th
                onClick={() => handleTableSort('name')}
                className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--hover-color)] transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("adminAttendance.table.columns.employeeName", "Employees Name")}
                  {getSortIcon('name')}
                </div>
              </th>
              <th
                onClick={() => handleTableSort('date')}
                className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--hover-color)] transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("adminAttendance.table.columns.date", "Date")}
                  {getSortIcon('date')}
                </div>
              </th>
              <th
                onClick={() => handleTableSort('checkIn')}
                className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--hover-color)] transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("adminAttendance.table.columns.checkIn", "Check-in")}
                  {getSortIcon('checkIn')}
                </div>
              </th>
              <th
                onClick={() => handleTableSort('checkOut')}
                className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--hover-color)] transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("adminAttendance.table.columns.checkOut", "Check-out")}
                  {getSortIcon('checkOut')}
                </div>
              </th>
              <th
                onClick={() => handleTableSort('workHours')}
                className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--hover-color)] transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("adminAttendance.table.columns.workHours", "Work hours")}
                  {getSortIcon('workHours')}
                </div>
              </th>
              <th
                onClick={() => handleTableSort('status')}
                className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--hover-color)] transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("adminAttendance.table.columns.status", "Status")}
                  {getSortIcon('status')}
                </div>
              </th>
              <th
                onClick={() => handleTableSort('location')}
                className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--hover-color)] transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("adminAttendance.table.columns.location", "Location")}
                  {getSortIcon('location')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--table-bg)]">
            {currentData.map((employee, index) => (
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
                <td className="py-4 px-6 text-gray-500 text-sm font-medium">{employee.workHours}</td>
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
