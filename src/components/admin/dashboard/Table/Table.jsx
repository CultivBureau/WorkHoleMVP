import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [designationFilter, setDesignationFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Status');

  return (
    <div className="w-full p-4">
      {/* Header */}
      <h1 className="text-xl text-start font-semibold text-[var(--text-color)] mb-4">Attendance Overview</h1>

      {/* Filters Section */}
      <div className="flex items-center gap-3 shadow-lg border border-[var(--border-color)] rounded-[22px] p-3 mb-4 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px] max-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[var(--sub-text-color)] w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--sub-text-color)] whitespace-nowrap">Designation</span>
            <div className="relative">
              <select
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
                className="w-[120px] h-[32px] appearance-none bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--sub-text-color)] pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--sub-text-color)] whitespace-nowrap">Location</span>
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-[100px] h-[32px] appearance-none bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Office">Office</option>
                <option value="Remote">Remote</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--sub-text-color)] pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--sub-text-color)] whitespace-nowrap">Status</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-[110px] h-[32px] appearance-none bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Status">All Status</option>
                <option value="On Time">On Time</option>
                <option value="Late">Late</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--sub-text-color)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* View All Link */}
        <button className="text-xs text-[var(--accent-color)] hover:text-[var(--accent-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 whitespace-nowrap hover:underline">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--bg-color)]">
              <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">Employee Name</th>
              <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">Designation</th>
              <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">Type</th>
              <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">Check In Time</th>
              <th className="text-left text-[var(--sub-text-color)] font-medium text-xs py-3 px-4">Status</th>
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
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
