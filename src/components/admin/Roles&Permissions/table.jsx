"use client"

import { useState } from "react"

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

const RolesTable = () => {
  const [sortBy, setSortBy] = useState("Newest First")
  const [location, setLocation] = useState("All")
  const [status, setStatus] = useState("All Status")
  const [dateFrom, setDateFrom] = useState("09/09/2025")
  const [dateTo, setDateTo] = useState("09/09/2025")

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-block"
    switch (status) {
      case "Present":
        return <span className={`${baseClasses} bg-green-50 text-green-600 border border-green-200`}>{status}</span>
      case "Absent":
        return <span className={`${baseClasses} bg-red-50 text-red-600 border border-red-200`}>{status}</span>
      case "Late arrival":
        return <span className={`${baseClasses} bg-yellow-50 text-yellow-600 border border-yellow-200`}>{status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-50 text-gray-600 border border-gray-200`}>{status}</span>
    }
  }

  const getLocationBadge = (location) => {
    if (location === "------") {
      return <span className="text-gray-400 text-sm">------</span>
    }

    const isOffice = location === "Work from office"
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-block border"
    return (
      <span
        className={`${baseClasses} ${
          isOffice 
            ? "bg-blue-50 text-blue-600 border-blue-200" 
            : "bg-gray-50 text-gray-600 border-gray-200"
        }`}
      >
        {location}
      </span>
    )
  }

  const getTimeStyle = (status, time) => {
    if (status === "Absent" && time.includes("00:00")) {
      return "text-red-500 text-sm"
    }
    return "text-gray-900 text-sm"
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header with filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 font-medium">Sort By</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 px-3 border border-gray-300 rounded-md text-[10px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 font-medium">Location</span>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="h-8 px-3 border border-gray-300 rounded-md text-[10px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All</option>
                <option value="Office">Office</option>
                <option value="Home">Home</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 font-medium">Status</span>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="h-8 px-3 border border-gray-300 rounded-md text-[10px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Status">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late arrival">Late arrival</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 font-medium">Date from</span>
              <select 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 px-3 border border-gray-300 rounded-md text-[10px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="09/09/2025">09/09/2025</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 font-medium">Date To</span>
              <select 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 px-3 border border-gray-300 rounded-md text-[10px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="09/09/2025">09/09/2025</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-600">5 of 18 page</span>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="h-8 w-8 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 border-b border-gray-200">
                Employees Name
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 border-b border-gray-200">
                Date
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  Check-in
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  Check-out
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  Work hours
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  Status
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  Location
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {employeeData.map((employee, index) => (
              <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {employee.avatar ? (
                        <img 
                          src={employee.avatar} 
                          alt={employee.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {getInitials(employee.name)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{employee.name}</span>
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

export default RolesTable
