"use client"

import { useState, useMemo } from "react"
import { Edit, Trash2, Eye } from "lucide-react"
import EditRole from "./edit_role"
import { useTranslation } from "react-i18next"

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
        role: "Manager",
        users: 15,
        lastUpdatedDate: "2025-08-12",
        status: "Active",
    },
    {
        id: 8,
        role: "Supervisor",
        users: 8,
        lastUpdatedDate: "2025-08-11",
        status: "Active",
    },
    {
        id: 9,
        role: "Coordinator",
        users: 12,
        lastUpdatedDate: "2025-08-10",
        status: "Inactive",
    },
    {
        id: 10,
        role: "Analyst",
        users: 18,
        lastUpdatedDate: "2025-08-09",
        status: "Active",
    },
    {
        id: 11,
        role: "Director",
        users: 5,
        lastUpdatedDate: "2025-08-08",
        status: "Active",
    },
    {
        id: 12,
        role: "Associate",
        users: 25,
        lastUpdatedDate: "2025-08-07",
        status: "Inactive",
    },
    {
        id: 13,
        role: "Specialist",
        users: 14,
        lastUpdatedDate: "2025-08-06",
        status: "Active",
    },
    {
        id: 14,
        role: "Consultant",
        users: 9,
        lastUpdatedDate: "2025-08-05",
        status: "Active",
    },
    {
        id: 15,
        role: "Executive",
        users: 3,
        lastUpdatedDate: "2025-08-04",
        status: "Active",
    },
    {
        id: 16,
        role: "Intern",
        users: 20,
        lastUpdatedDate: "2025-08-03",
        status: "Inactive",
    }
]

const RolesTable = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [roleType, setRoleType] = useState(t('roles.filters.roleType'))
    const [status, setStatus] = useState(t('roles.filters.allStatus'))
    const [selectedDate, setSelectedDate] = useState("")
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Filter the data based on selected filters
    const filteredData = useMemo(() => {
        return rolesData.filter(role => {
            // Role filter
            const roleMatches = roleType === t('roles.filters.roleType') || role.role === roleType;

            // Status filter
            const statusMatches = status === t('roles.filters.allStatus') || role.status === status;

            // Date filter
            const dateMatches = selectedDate === "" || role.lastUpdatedDate === selectedDate;

            return roleMatches && statusMatches && dateMatches;
        });
    }, [roleType, status, selectedDate, t]);

    // Calculate pagination info
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [roleType, status, selectedDate]);

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setIsEditOpen(true);
    };

    const handleSaveRole = (updatedRole) => {
        // Here you would typically update the role in your data source
        console.log('Saving role:', updatedRole);
        // You can implement the actual save logic here
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-block border"
        switch (status) {
            case "Active":
                return <span className={`${baseClasses} bg-[var(--approved-leave-box-bg)] text-[var(--success-color)] border-[var(--success-color)]`}>{t('roles.filters.active')}</span>
            case "Inactive":
                return <span className={`${baseClasses} bg-[var(--rejected-leave-box-bg)] text-[var(--error-color)] border-[var(--error-color)]`}>{t('roles.filters.inactive')}</span>
            default:
                return <span className={`${baseClasses} bg-[var(--container-color)] text-[var(--sub-text-color)] border-[var(--border-color)]`}>{status}</span>
        }
    }

    // Create empty rows to maintain consistent table height (6 rows total)
    const emptyRowsNeeded = itemsPerPage - currentPageData.length;
    const emptyRows = Array(emptyRowsNeeded).fill(null);

    // Render the table row with cells for both RTL and LTR
    const renderTableRows = () => {
        return currentPageData.map((role) => (
            <tr key={role.id} className="border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--hover-color)]">
                <td className={`py-4 px-6 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <span className="font-medium text-[var(--text-color)] text-sm">{role.role}</span>
                </td>
                <td className={`py-4 px-6 text-[var(--text-color)] text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}>{role.users}</td>
                <td className="py-4 px-6">
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <Eye className="w-4 h-4 text-[var(--sub-text-color)]" />
                        <span className="text-[var(--sub-text-color)] text-sm">{t('roles.view')}</span>
                    </div>
                </td>
                <td className={`py-4 px-6 text-[var(--sub-text-color)] text-sm ${isArabic ? 'text-right' : 'text-left'}`}>{role.lastUpdatedDate}</td>
                <td className={`py-4 px-6 ${isArabic ? 'text-right' : 'text-left'}`}>{getStatusBadge(role.status)}</td>
                <td className="py-4 px-6">
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <button
                            onClick={() => handleEditRole(role)}
                            className="p-2 text-[var(--accent-color)] hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                            aria-label={t('employees.actions.edit')}
                            title={t('employees.actions.edit')}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-[var(--error-color)] hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                            aria-label={t('employees.actions.delete')}
                            title={t('employees.actions.delete')}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className="flex flex-col h-full min-h-0" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* Filters and header section - keep this outside the scroll container */}
            <div className="mb-4 flex-shrink-0">
                <div className="flex bg-[var(--bg-color)] p-4 w-[98%] h-max shadow-xl rounded-3xl border border-[var(--border-color)] flex-wrap items-center gap-4 justify-between">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-[var(--sub-text-color)]">{t('roles.table.role')}</span>
                            <select
                                value={roleType}
                                onChange={(e) => setRoleType(e.target.value)}
                                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                                dir={isArabic ? 'rtl' : 'ltr'}
                            >
                                <option value={t('roles.filters.roleType')}>{t('roles.filters.roleType')}</option>
                                <option value="Employee">{t('employees.table.employee')}</option>
                                <option value="Team Lead">{t('profile.teamLead')}</option>
                                <option value="Admin">{t('aside.settingsItem')}</option>
                                <option value="HR">{t('employees.professionalInfo.humanResources')}</option>
                                <option value="Manager">{t('employees.professionalInfo.manager')}</option>
                                <option value="Supervisor">{t('profile.teamLead')}</option>
                                {/* Other options... */}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-[var(--sub-text-color)]">{t('roles.table.status')}</span>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                                dir={isArabic ? 'rtl' : 'ltr'}
                            >
                                <option value={t('roles.filters.allStatus')}>{t('roles.filters.allStatus')}</option>
                                <option value="Active">{t('roles.filters.active')}</option>
                                <option value="Inactive">{t('roles.filters.inactive')}</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-[var(--sub-text-color)]">{t('roles.lastUpdated')}</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] cursor-pointer"
                                    style={{ minWidth: "120px" }}
                                    dir={isArabic ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[10px] text-[var(--sub-text-color)]">
                            {t('leaves.table.page')} {currentPage} {t('leaves.table.of')} {totalPages} ({totalItems} {t('leaves.table.entries')})
                        </span>
                        <div className={`flex items-center gap-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {/* Correctly flip the arrows for RTL */}
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isArabic ? "M15 19l-7-7 7-7" : "M15 19l-7-7 7-7"} />
                                </svg>
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="h-4 w-4 text-[var(--sub-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {/* Correctly flip the arrows for RTL */}
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isArabic ? "M9 5l7 7-7 7" : "M9 5l7 7-7 7"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area with table and edit panel */}
            <div className="flex gap-4 h-full min-h-0 flex-1">
                {/* In Arabic, we'll reverse the order and the width logic */}
                {isArabic ? (
                    <>
                        {/* Edit Role Section - in Arabic comes from the left */}
                        {isEditOpen && (
                            <div className="w-[30%] transition-all duration-300 h-full min-h-0">
                                <EditRole
                                    isOpen={isEditOpen}
                                    onClose={() => setIsEditOpen(false)}
                                    roleData={selectedRole}
                                    onSave={handleSaveRole}
                                />
                            </div>
                        )}

                        {/* Table Section */}
                        <div className={`${isEditOpen ? 'w-[70%]' : 'w-full'} transition-all duration-300 h-full min-h-0 flex flex-col`}>
                            {/* Table container with horizontal scroll */}
                            <div className="overflow-x-auto flex-1 border border-[var(--border-color)] rounded-lg">
                                <table className="min-w-[800px] w-full">
                                    <thead className="bg-[var(--bg-table-header)]">
                                        <tr>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-right">
                                                {t('roles.table.role')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-right">
                                                {t('roles.table.users')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-right">
                                                {t('roles.table.actions')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-right">
                                                {t('roles.table.lastUpdated')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-right">
                                                {t('roles.table.status')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-right">
                                                {t('roles.table.actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableRows()}
                                        {/* Empty rows */}
                                        {emptyRows.map((_, index) => (
                                            <tr key={`empty-${index}`} className="border-b border-[var(--border-color)] last:border-b-0">
                                                <td colSpan={6} className="h-[52px]"></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Table Section */}
                        <div className={`${isEditOpen ? 'w-[70%]' : 'w-full'} transition-all duration-300 h-full min-h-0 flex flex-col`}>
                            {/* Table container with horizontal scroll */}
                            <div className="overflow-x-auto flex-1 border border-[var(--border-color)] rounded-lg">
                                <table className="min-w-[800px] w-full">
                                    <thead className="bg-[var(--bg-table-header)]">
                                        <tr>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-left">
                                                {t('roles.table.role')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-left">
                                                {t('roles.table.users')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-left">
                                                {t('roles.table.actions')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-left">
                                                {t('roles.table.lastUpdated')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-left">
                                                {t('roles.table.status')}
                                            </th>
                                            <th className="py-3 px-4 text-sm font-medium text-[var(--text-color)] text-left">
                                                {t('roles.table.actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableRows()}
                                        {/* Empty rows */}
                                        {emptyRows.map((_, index) => (
                                            <tr key={`empty-${index}`} className="border-b border-[var(--border-color)] last:border-b-0">
                                                <td colSpan={6} className="h-[52px]"></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Edit Role Section - in English comes from the right */}
                        {isEditOpen && (
                            <div className="w-[30%] transition-all duration-300 h-full min-h-0">
                                <EditRole
                                    isOpen={isEditOpen}
                                    onClose={() => setIsEditOpen(false)}
                                    roleData={selectedRole}
                                    onSave={handleSaveRole}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RolesTable;
