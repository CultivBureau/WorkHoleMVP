"use client"

import { useState, useMemo } from "react"
import { Edit, Trash2, Eye, Calendar } from "lucide-react"
import EditRole from "./edit_role"

// Sample roles data matching the image
const rolesData = [
    {
        id: 1,
        role: "Employee",
        users: 123,
        lastUpdatedDate: "2025-08-15",
        status: "Active",
    },
    {
        id: 2,
        role: "Team Lead",
        users: 21,
        lastUpdatedDate: "2025-08-15",
        status: "Inactive",
    },
    {
        id: 3,
        role: "Admin",
        users: 11,
        lastUpdatedDate: "2025-08-15",
        status: "Active",
    },
    {
        id: 4,
        role: "HR",
        users: 5,
        lastUpdatedDate: "2025-08-15",
        status: "Active",
    },
    {
        id: 5,
        role: "Team Lead",
        users: 11,
        lastUpdatedDate: "2025-08-14",
        status: "Active",
    },
    {
        id: 6,
        role: "HR",
        users: 23,
        lastUpdatedDate: "2025-08-13",
        status: "Inactive",
    },
    {
        id: 7,
        role: "Team Lead",
        users: 21,
        lastUpdatedDate: "2025-08-12",
        status: "Active",
    },
]

const RolesTable = () => {
    const [roleType, setRoleType] = useState("Role type")
    const [status, setStatus] = useState("All Status")
    const [selectedDate, setSelectedDate] = useState("")
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)

    // Filter the data based on selected filters
    const filteredData = useMemo(() => {
        return rolesData.filter(role => {
            // Role filter
            const roleMatches = roleType === "Role type" || role.role === roleType;

            // Status filter
            const statusMatches = status === "All Status" || role.status === status;

            // Date filter
            const dateMatches = selectedDate === "" || role.lastUpdatedDate === selectedDate;

            return roleMatches && statusMatches && dateMatches;
        });
    }, [roleType, status, selectedDate]);

    // Calculate pagination info
    const totalItems = rolesData.length;
    const itemsPerPage = 7;
    const currentPage = 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setIsEditOpen(true);
    };

    const handleSaveRole = (updatedRole) => {
        // Here you would typically update the role in your data source
        console.log('Saving role:', updatedRole);
        // You can implement the actual save logic here
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-block border"
        switch (status) {
            case "Active":
                return <span className={`${baseClasses} bg-[var(--approved-leave-box-bg)] text-[var(--success-color)] border-[var(--success-color)]`}>{status}</span>
            case "Inactive":
                return <span className={`${baseClasses} bg-[var(--rejected-leave-box-bg)] text-[var(--error-color)] border-[var(--error-color)]`}>{status}</span>
            default:
                return <span className={`${baseClasses} bg-[var(--container-color)] text-[var(--sub-text-color)] border-[var(--border-color)]`}>{status}</span>
        }
    }

    return (
        <div className="flex gap-4 h-full">
            {/* Table Section */}
            <div className={`${isEditOpen ? 'w-[80%]' : 'w-full'} transition-all duration-300`}>
                <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] h-full flex flex-col">
                    {/* Header with filters */}
                    <div className="px-6 py-4 border-b flex justify-center items-center bg-[var(--bg-color)]">
                        <div className="flex bg-[var(--bg-color)] p-4 w-[98%] h-max shadow-xl rounded-3xl border border-[var(--border-color)] flex-wrap items-center gap-4 justify-between">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-[var(--sub-text-color)]">Role</span>
                                    <select
                                        value={roleType}
                                        onChange={(e) => setRoleType(e.target.value)}
                                        className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                                    >
                                        <option value="Role type">Role type</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Team Lead">Team Lead</option>
                                        <option value="Admin">Admin</option>
                                        <option value="HR">HR</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-[var(--sub-text-color)]">Status</span>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                                    >
                                        <option value="All Status">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-[var(--sub-text-color)]">Last Updated</span>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] cursor-pointer"
                                            style={{ minWidth: "120px" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-[var(--sub-text-color)]">
                                    {filteredData.length} of {totalItems} items
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--table-header-bg)]">
                                <tr>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                                        Role
                                    </th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                                        Users
                                    </th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                                        Permissions
                                    </th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                                        Last Updated
                                    </th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                                        <div className="flex items-center gap-1 cursor-pointer">
                                            Status
                                            <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[var(--table-bg)]">
                                {filteredData.length > 0 ? (
                                    filteredData.map((role, index) => (
                                        <tr key={role.id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-color)] transition-colors">
                                            <td className="py-4 px-6">
                                                <span className="font-medium text-[var(--text-color)] text-sm">{role.role}</span>
                                            </td>
                                            <td className="py-4 px-6 text-[var(--text-color)] text-sm font-medium">{role.users}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4 text-[var(--sub-text-color)]" />
                                                    <span className="text-[var(--sub-text-color)] text-sm">view</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-[var(--sub-text-color)] text-sm">{role.lastUpdatedDate}</td>
                                            <td className="py-4 px-6">{getStatusBadge(role.status)}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditRole(role)}
                                                        className="p-2 text-[var(--accent-color)] hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-[var(--error-color)] hover:bg-[var(--hover-color)] rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 px-6 text-center text-[var(--sub-text-color)]">
                                            No roles found matching the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Role Section */}
            {isEditOpen && (
                <div className="w-[30%] transition-all duration-300">
                    <EditRole
                        isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        roleData={selectedRole}
                        onSave={handleSaveRole}
                    />
                </div>
            )}
        </div>
    )
}

export default RolesTable
