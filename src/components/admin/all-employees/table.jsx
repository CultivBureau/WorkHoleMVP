import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight, Search, LayoutGrid, TableIcon, Plus, Eye, Edit, Trash2 } from "lucide-react";
import EmployeeCard from "./employee-card";

const EmployeesTable = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [searchTerm, setSearchTerm] = useState("");
    const [joinDateFilter, setJoinDateFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
    const itemsPerPage = viewMode === "grid" ? 8 : 6; // 8 cards (4x2) or 6 table rows per page

    // Mock data - replace with actual API call
    const mockEmployees = [
        {
            id: 1,
            name: "Layla wael",
            position: "UX UI Designer",
            department: "Design",
            joinDate: "2/4/2024",
            status: "Active",
            avatar: "https://i.pravatar.cc/150?img=1",
            employeeId: "EMP-001"
        },
        {
            id: 2,
            name: "Ahmed Ali",
            position: "Frontend Developer",
            department: "Software",
            joinDate: "15/3/2024",
            status: "Active",
            avatar: "https://i.pravatar.cc/150?img=2",
            employeeId: "EMP-002"
        },
        {
            id: 3,
            name: "Sara Mohamed",
            position: "Product Manager",
            department: "Product",
            joinDate: "10/2/2024",
            status: "Inactive",
            avatar: "https://i.pravatar.cc/150?img=3",
            employeeId: "EMP-003"
        },
        {
            id: 4,
            name: "Omar Hassan",
            position: "Backend Developer",
            department: "Software",
            joinDate: "5/1/2024",
            status: "Active",
            avatar: "https://i.pravatar.cc/150?img=4",
            employeeId: "EMP-004"
        },
        {
            id: 5,
            name: "Fatima Ali",
            position: "QA Engineer",
            department: "Quality",
            joinDate: "20/3/2024",
            status: "Pending",
            avatar: "https://i.pravatar.cc/150?img=5",
            employeeId: "EMP-005"
        },
        // Add more mock data...
        ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 6,
            name: `Employee ${i + 6}`,
            position: ["UX UI Designer", "Frontend Developer", "Backend Developer", "Product Manager"][i % 4],
            department: ["Design", "Software", "Product", "Quality"][i % 4],
            joinDate: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2024`,
            status: ["Active", "Inactive", "Pending"][i % 3],
            avatar: `https://i.pravatar.cc/150?img=${i + 6}`,
            employeeId: `EMP-${String(i + 6).padStart(3, '0')}`
        }))
    ];

    // Filter data
    const filteredEmployees = mockEmployees.filter(employee => {
        return (
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (joinDateFilter === "" || employee.joinDate.includes(joinDateFilter)) &&
            (departmentFilter === "" || employee.department === departmentFilter) &&
            (roleFilter === "" || employee.position === roleFilter) &&
            (statusFilter === "" || employee.status === statusFilter)
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, joinDateFilter, departmentFilter, roleFilter, statusFilter, viewMode]);

    // Get unique values for filter options
    const uniqueDepartments = [...new Set(mockEmployees.map(emp => emp.department))];
    const uniqueRoles = [...new Set(mockEmployees.map(emp => emp.position))];
    const uniqueJoinDates = [...new Set(mockEmployees.map(emp => emp.joinDate))];

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm("");
        setJoinDateFilter("");
        setDepartmentFilter("");
        setRoleFilter("");
        setStatusFilter("");
    };

    // Active filters count
    const activeFiltersCount = [joinDateFilter, departmentFilter, roleFilter, statusFilter].filter(filter => filter !== "").length;

    // Active filters chips
    const activeFilters = [
        { key: 'joinDate', value: joinDateFilter, setter: setJoinDateFilter },
        { key: 'department', value: departmentFilter, setter: setDepartmentFilter },
        { key: 'role', value: roleFilter, setter: setRoleFilter },
        { key: 'status', value: statusFilter, setter: setStatusFilter }
    ].filter(filter => filter.value !== "");

    // Filter component
    const FilterSelect = ({ value, onChange, options, label, placeholder, icon }) => (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="border rounded-lg px-4 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[140px] font-medium"
                style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    color: value ? 'var(--primary-color)' : 'var(--sub-text-color)',
                    paddingRight: isArabic ? '16px' : '35px',
                    paddingLeft: isArabic ? '35px' : '16px',
                    direction: isArabic ? 'rtl' : 'ltr',
                }}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <ChevronDown
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none ${isArabic ? 'left-3' : 'right-3'}`}
                style={{ color: 'var(--primary-color)' }}
            />
            {value && (
                <div
                    className={`absolute top-1 ${isArabic ? 'left-1' : 'right-1'} w-2 h-2 rounded-full`}
                    style={{ backgroundColor: 'var(--primary-color)' }}
                />
            )}
        </div>
    );

    // Action buttons for table
    const ActionButtons = ({ employee }) => (
        <div className="flex items-center gap-2">
            <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title={t("employees.actions.view", "View")}
            >
                <Eye className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} />
            </button>
            <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title={t("employees.actions.edit", "Edit")}
            >
                <Edit className="w-4 h-4" style={{ color: 'var(--sub-text-color)' }} />
            </button>
            <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title={t("employees.actions.delete", "Delete")}
            >
                <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
            </button>
        </div>
    );

    return (
        <div className="w-full" dir={isArabic ? "rtl" : "ltr"}>
            {/* Filters and Controls Container */}
            <div
                className="rounded-xl border shadow-sm p-6 mb-2"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)'
                }}
            >
                {/* Search and View Toggle */}
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search
                            className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 ${isArabic ? 'right-3' : 'left-3'}`}
                            style={{ color: 'var(--sub-text-color)' }}
                        />
                        <input
                            type="text"
                            placeholder={t("employees.search.placeholder", "Search employees...")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                            style={{
                                borderColor: 'var(--border-color)',
                                backgroundColor: 'var(--bg-color)',
                                color: 'var(--text-color)',
                                paddingLeft: isArabic ? '16px' : '40px',
                                paddingRight: isArabic ? '40px' : '16px',
                            }}
                        />
                    </div>

                    {/* View Toggle and Add Button */}
                    <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {/* View Mode Toggle */}
                        <div className="flex items-center border rounded-lg p-1" style={{ borderColor: 'var(--border-color)' }}>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded transition-all duration-200 ${viewMode === "grid" ? 'shadow-sm' : ''}`}
                                style={{
                                    backgroundColor: viewMode === "grid" ? 'var(--primary-color)' : 'transparent',
                                    color: viewMode === "grid" ? 'white' : 'var(--sub-text-color)'
                                }}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={`p-2 rounded transition-all duration-200 ${viewMode === "table" ? 'shadow-sm' : ''}`}
                                style={{
                                    backgroundColor: viewMode === "table" ? 'var(--primary-color)' : 'transparent',
                                    color: viewMode === "table" ? 'white' : 'var(--sub-text-color)'
                                }}
                            >
                                <TableIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Add New Employee Button */}
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            <Plus className="w-4 h-4" />
                            {t("employees.addNew", "Add New Employee")}
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className={`flex flex-wrap items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <FilterSelect
                        value={joinDateFilter}
                        onChange={(e) => setJoinDateFilter(e.target.value)}
                        options={uniqueJoinDates}
                        placeholder={t("employees.filters.joinDate", "Join Date")}
                    />

                    <FilterSelect
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        options={uniqueDepartments}
                        placeholder={t("employees.filters.department", "Department")}
                    />

                    <FilterSelect
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        options={uniqueRoles}
                        placeholder={t("employees.filters.role", "Role")}
                    />

                    <FilterSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={["Active", "Inactive", "Pending"]}
                        placeholder={t("employees.filters.status", "Status")}
                    />

                    {/* Clear All Button */}
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                            style={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'white'
                            }}
                        >
                            {t("employees.clearAll", "Clear All")}
                        </button>
                    )}

                    {/* Results Count */}
                    <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
                        {filteredEmployees.length} {t("employees.results", "results")}
                    </div>
                </div>

                {/* Active Filters Chips */}
                {activeFilters.length > 0 && (
                    <div className={`flex flex-wrap items-center gap-2 mt-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {activeFilters.map((filter) => (
                            <div
                                key={filter.key}
                                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs border"
                                style={{
                                    backgroundColor: 'var(--table-header-bg)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-color)'
                                }}
                            >
                                <span>{filter.value}</span>
                                <button
                                    onClick={() => filter.setter("")}
                                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                                >
                                    <span className="text-xs">×</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div
                className="rounded-xl border shadow-sm"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)',
                    height: '525px' // Increased height to accommodate pagination properly
                }}
            >
                {viewMode === "grid" ? (
                    /* Grid View - Fixed Height */
                    <div className="h-full flex flex-col">
                        <div className="flex-1 p-4" style={{ height: 'calc(100% - 60px)' }}>
                            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
                                {/* Render exactly 8 cards in 4x2 grid */}
                                {Array.from({ length: 8 }).map((_, index) => {
                                    const employee = paginatedEmployees[index];
                                    return employee ? (
                                        <EmployeeCard
                                            key={employee.id}
                                            name={employee.name}
                                            position={employee.position}
                                            department={employee.department}
                                            joinDate={employee.joinDate}
                                            status={employee.status}
                                            avatar={employee.avatar}
                                            onCardClick={() => console.log("Card clicked:", employee.name)}
                                            className="h-full"
                                        />
                                    ) : (
                                        <div key={`empty-${index}`} className="h-full" />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pagination for Grid */}
                        <div
                            className={`px-6 py-3 border-t flex items-center justify-between h-[60px] ${isArabic ? 'flex-row-reverse' : ''}`}
                            style={{ borderColor: 'var(--divider-color)' }}
                        >
                            <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
                                {t("employees.pagination.page", "Page")} {currentPage} {t("employees.pagination.of", "of")} {totalPages}
                                ({filteredEmployees.length} {t("employees.pagination.total", "total employees")})
                            </div>
                            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Table View - Fixed Height */
                    <div className="h-full flex flex-col">
                        <div className="flex-1" style={{ height: 'calc(100% - 60px)' }}>
                            <table className="w-full">
                                <thead style={{ backgroundColor: 'var(--table-header-bg)' }} className="sticky top-0">
                                    <tr>
                                        <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)' }}>
                                            {t("employees.table.employee", "Employee")}
                                        </th>
                                        <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)' }}>
                                            {t("employees.table.role", "Role")}
                                        </th>
                                        <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)' }}>
                                            {t("employees.table.joinDate", "Join Date")}
                                        </th>
                                        <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)' }}>
                                            {t("employees.table.department", "Department")}
                                        </th>
                                        <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)' }}>
                                            {t("employees.table.status", "Status")}
                                        </th>
                                        <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)' }}>
                                            {t("employees.table.action", "Action")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEmployees.map((employee, index) => (
                                        <tr
                                            key={employee.id}
                                            className="transition-colors duration-200 cursor-pointer hover:shadow-sm"
                                            style={{
                                                borderBottom: '1px solid var(--table-border)',
                                                backgroundColor: index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-alt-bg)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--table-header-bg)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-alt-bg)';
                                            }}
                                        >
                                            <td className={`px-6 py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                                    <img
                                                        src={employee.avatar}
                                                        alt={employee.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=15919B&color=fff&size=40`;
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-xs" style={{ color: 'var(--sub-text-color)' }}>
                                                            {employee.employeeId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                                                style={{ color: 'var(--sub-text-color)' }}>
                                                {employee.position}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                                                style={{ color: 'var(--sub-text-color)' }}>
                                                {employee.joinDate}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                                                style={{ color: 'var(--sub-text-color)' }}>
                                                {employee.department}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${employee.status === "Active"
                                                        ? 'bg-green-100 text-green-700'
                                                        : employee.status === "Inactive"
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <ActionButtons employee={employee} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination for Table */}
                        <div
                            className={`px-6 py-3 border-t flex items-center justify-between h-[60px] ${isArabic ? 'flex-row-reverse' : ''}`}
                            style={{ borderColor: 'var(--divider-color)' }}
                        >
                            <div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
                                {t("employees.pagination.page", "Page")} {currentPage} {t("employees.pagination.of", "of")} {totalPages}
                                ({filteredEmployees.length} {t("employees.pagination.total", "total employees")})
                            </div>
                            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeesTable;