import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Search, LayoutGrid, TableIcon, Plus, Eye, Edit, Trash2 } from "lucide-react";
import EmployeeCard from "./employee-card";

const EmployeesTable = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";
    const [searchTerm, setSearchTerm] = useState("");
    const [joinDateFilter, setJoinDateFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"

    // Responsive items per page based on screen size and view mode
    const getItemsPerPage = () => {
        if (viewMode === "grid") {
            // For grid: 8 on desktop (4x2), 4 on mobile (2x2)
            return window.innerWidth < 768 ? 4 : 8;
        } else {
            // For table: same as before
            return 6;
        }
    };

    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

    // Update items per page on resize
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(getItemsPerPage());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [viewMode]);

    // Update items per page when view mode changes
    useEffect(() => {
        setItemsPerPage(getItemsPerPage());
    }, [viewMode]);

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
    }, [searchTerm, joinDateFilter, departmentFilter, roleFilter, statusFilter, viewMode, itemsPerPage]);

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

    // Responsive FilterSelect
    const FilterSelect = ({ value, onChange, options, placeholder }) => (
        <div className="relative w-full mb-2 md:mb-0">
            <select
                value=""
                onChange={onChange}
                className="w-full border text-center     rounded-full px-4 py-2 text-xs font-medium gradient-text transition-all duration-200 appearance-none"
                style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--accent-color)',
                    direction: isArabic ? 'rtl' : 'ltr',
                    cursor: 'pointer'
                }}
            >
                <option value="" disabled className="gradient-text">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option} style={{ color: 'var(--text-color)' }}>
                        {option}
                    </option>
                ))}
            </select>
            <ChevronDown
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none gradient-text ${isArabic ? 'left-4' : 'right-4'}`}
            />
        </div>
    );

    // Action buttons for table
    const ActionButtons = ({ employee }) => (
        <div className="flex items-center gap-1 md:gap-2">
            <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title={t("employees.actions.view", "View")}
            >
                <Eye className="w-3 h-3 md:w-4 md:h-4" style={{ color: 'var(--sub-text-color)' }} />
            </button>
            <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title={t("employees.actions.edit", "Edit")}
            >
                <Edit className="w-3 h-3 md:w-4 md:h-4" style={{ color: 'var(--sub-text-color)' }} />
            </button>
            <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title={t("employees.actions.delete", "Delete")}
            >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" style={{ color: '#ef4444' }} />
            </button>
        </div>
    );

    const handleAddNewEmployee = () => {
        navigate("/pages/admin/new-employee");
    };

    return (
        <div className="w-full" dir={isArabic ? "rtl" : "ltr"}>
            {/* Filters and Controls Container */}
            <div
                className="rounded-xl border shadow-sm p-3 md:p-3 mb-2"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--shadow-color)'
                }}
            >
                {/* First Row - Search and Filter Buttons */}
                <div className={`grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-3 mb-4 items-center ${isArabic ? 'direction-rtl' : ''}`}>
                    {/* Search - Takes 3 columns on desktop, full width on mobile */}
                    <div className="md:col-span-3 col-span-1 w-full mb-2 md:mb-0 relative">
                        <Search
                            className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 ${isArabic ? 'right-3' : 'left-3'}`}
                            style={{ color: 'var(--sub-text-color)' }}
                        />
                        <input
                            type="text"
                            placeholder={t("employees.search.placeholder", "Search employees...")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border rounded-xl py-2 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                            style={{
                                borderColor: 'var(--border-color)',
                                backgroundColor: 'var(--bg-color)',
                                color: 'var(--text-color)',
                                paddingLeft: isArabic ? '16px' : '40px',
                                paddingRight: isArabic ? '40px' : '16px',
                                focusRingColor: 'var(--accent-color)'
                            }}
                        />
                    </div>

                    {/* Each filter/select is full width on mobile, 1 col on desktop */}
                    <div className="md:col-span-1 col-span-1 w-full">
                        <div className="relative w-full">
                            <input
                                type="date"
                                value={joinDateFilter}
                                onChange={(e) => setJoinDateFilter(e.target.value)}
                                className="w-full border rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 opacity-0 absolute inset-0 cursor-pointer"
                                style={{
                                    colorScheme: 'var(--theme)'
                                }}
                            />
                            <div className="w-full border text-center rounded-full px-4 py-2 text-xs font-medium gradient-text transition-all duration-200 pointer-events-none"
                                style={{
                                    borderColor: 'var(--border-color)',
                                    backgroundColor: 'var(--bg-color)',
                                    color: 'var(--accent-color)'
                                }}>
                                {joinDateFilter ? new Date(joinDateFilter).toLocaleDateString() : t("employees.filters.joinDate")}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-1 col-span-1 w-full">
                        <FilterSelect
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            options={uniqueDepartments}
                            placeholder={t("employees.filters.department")}
                        />
                    </div>
                    <div className="md:col-span-1 col-span-1 w-full">
                        <FilterSelect
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            options={uniqueRoles}
                            placeholder={t("employees.filters.role")}
                        />
                    </div>
                    <div className="md:col-span-1 col-span-1 w-full">
                        <FilterSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={["Active", "Inactive", "Pending"]}
                            placeholder={t("employees.filters.status")}
                        />
                    </div>
                    <div className="md:col-span-1 col-span-1 w-full">
                        {activeFiltersCount > 0 ? (
                            <button
                                onClick={clearAllFilters}
                                className="w-full px-3 py-1 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 border gradient-bg"
                                style={{
                                    color: 'white',
                                    borderColor: 'var(--accent-color)'
                                }}
                            >
                                <span className="hidden md:inline">{t("employees.clearAll", "Clear All")}</span>
                                <span className="md:hidden">Clear</span>
                            </button>
                        ) : (
                            <div className="w-full h-full"></div>
                        )}
                    </div>
                </div>

                {/* Second Row - View Toggle, Add Button, and Active Filters */}
                <div className={`flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {/* Left side - Active Filters Chips */}
                    <div className={`flex flex-wrap items-center gap-2 flex-1 w-full md:w-auto ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {activeFilters.length > 0 && (
                            <>
                                {activeFilters.map((filter) => (
                                    <div
                                        key={filter.key}
                                        className="flex items-center gap-2 px-2 md:px-3 py-1 rounded-full text-xs border"
                                        style={{
                                            backgroundColor: 'var(--menu-active-bg)',
                                            borderColor: 'var(--accent-color)',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        <span>{filter.value}</span>
                                        <button
                                            onClick={() => filter.setter("")}
                                            className="w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                                            style={{ color: 'var(--accent-color)' }}
                                        >
                                            <span className="text-xs">×</span>
                                        </button>
                                    </div>
                                ))}
                                {/* Results Count */}
                                <div className="text-xs md:text-sm font-medium ml-2" style={{ color: 'var(--sub-text-color)' }}>
                                    {filteredEmployees.length} {t("employees.results", "results")}
                                </div>
                            </>
                        )}
                        {activeFilters.length === 0 && (
                            <div className="text-xs md:text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
                                {filteredEmployees.length} {t("employees.results", "results")}
                            </div>
                        )}
                    </div>

                    {/* Right side - View Toggle and Add Button */}
                    <div className={`flex items-center gap-3 md:gap-4 w-full md:w-auto justify-end`}>
                        {/* View Mode Toggle */}
                        <div
                            className="flex items-center rounded-xl p-1"
                            style={{
                                backgroundColor: 'var(--menu-active-bg)',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${viewMode === "grid" ? 'shadow-sm' : ''}`}
                                style={{
                                    backgroundColor: viewMode === "grid" ? 'var(--accent-color)' : 'transparent',
                                    color: viewMode === "grid" ? 'white' : 'var(--sub-text-color)'
                                }}
                            >
                                <LayoutGrid className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${viewMode === "table" ? 'shadow-sm' : ''}`}
                                style={{
                                    backgroundColor: viewMode === "table" ? 'var(--accent-color)' : 'transparent',
                                    color: viewMode === "table" ? 'white' : 'var(--sub-text-color)'
                                }}
                            >
                                <TableIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        </div>

                        {/* Add New Employee Button */}
                        <button
                            onClick={handleAddNewEmployee}
                            className="gradient-bg flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-white transition-all duration-200 hover:shadow-lg"
                            style={{
                                border: '1px solid var(--accent-color)'
                            }}
                        >
                            <Plus className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">{t("employees.addNew", "Add New Employee")}</span>
                            <span className="sm:hidden">{t("employees.add", "Add")}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div
                className="rounded-xl border shadow-sm"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)',
                    height: '400px md:525px', // Responsive height
                    boxShadow: 'var(--shadow-color)'
                }}
            >
                {viewMode === "grid" ? (
                    /* Grid View - Responsive */
                    <div className="h-full flex flex-col">
                        <div className="flex-1 p-2 md:p-4" style={{ height: 'calc(100% - 60px)' }}>
                            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-full">
                                {/* Render cards based on responsive layout */}
                                {Array.from({ length: itemsPerPage }).map((_, index) => {
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
                            className={`px-3 md:px-6 py-3 border-t flex items-center justify-between h-[60px] ${isArabic ? 'flex-row-reverse' : ''}`}
                            style={{ borderColor: 'var(--divider-color)' }}
                        >
                            <div className="text-xs md:text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
                                <span className="hidden md:inline">
                                    {t("employees.pagination.page", "Page")} {currentPage} {t("employees.pagination.of", "of")} {totalPages}
                                    ({filteredEmployees.length} {t("employees.pagination.total", "total employees")})
                                </span>
                                <span className="md:hidden">
                                    {currentPage}/{totalPages} ({filteredEmployees.length})
                                </span>
                            </div>
                            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 md:p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronRight className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />}
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 md:p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Table View - Responsive with horizontal scroll */
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-x-auto" style={{ height: 'calc(100% - 60px)' }}>
                            <table className="w-full min-w-[800px]"> {/* Minimum width to prevent squashing */}
                                <thead style={{ backgroundColor: 'var(--table-header-bg)' }} className="sticky top-0">
                                    <tr>
                                        <th className={`px-3 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)', minWidth: '150px' }}>
                                            {t("employees.table.employee", "Employee")}
                                        </th>
                                        <th className={`px-3 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)', minWidth: '120px' }}>
                                            {t("employees.table.role", "Role")}
                                        </th>
                                        <th className={`px-3 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)', minWidth: '100px' }}>
                                            {t("employees.table.joinDate", "Join Date")}
                                        </th>
                                        <th className={`px-3 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)', minWidth: '120px' }}>
                                            {t("employees.table.department", "Department")}
                                        </th>
                                        <th className={`px-3 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)', minWidth: '100px' }}>
                                            {t("employees.table.status", "Status")}
                                        </th>
                                        <th className={`px-3 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
                                            style={{ color: 'var(--table-header-text)', minWidth: '100px' }}>
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
                                            <td className={`px-3 md:px-6 py-3 md:py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <div className={`flex items-center gap-2 md:gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                                    <img
                                                        src={employee.avatar}
                                                        alt={employee.name}
                                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=15919B&color=fff&size=40`;
                                                        }}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-xs md:text-sm font-medium truncate" style={{ color: 'var(--text-color)' }}>
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-xs truncate" style={{ color: 'var(--sub-text-color)' }}>
                                                            {employee.employeeId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                                                style={{ color: 'var(--sub-text-color)' }}>
                                                <div className="truncate">{employee.position}</div>
                                            </td>
                                            <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                                                style={{ color: 'var(--sub-text-color)' }}>
                                                {employee.joinDate}
                                            </td>
                                            <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm ${isArabic ? 'text-right' : 'text-left'}`}
                                                style={{ color: 'var(--sub-text-color)' }}>
                                                <div className="truncate">{employee.department}</div>
                                            </td>
                                            <td className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <span
                                                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${employee.status === "Active"
                                                        ? 'bg-green-100 text-green-700'
                                                        : employee.status === "Inactive"
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className={`px-3 md:px-6 py-3 md:py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <ActionButtons employee={employee} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination for Table */}
                        <div
                            className={`px-3 md:px-6 py-3 border-t flex items-center justify-between h-[60px] ${isArabic ? 'flex-row-reverse' : ''}`}
                            style={{ borderColor: 'var(--divider-color)' }}
                        >
                            <div className="text-xs md:text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
                                <span className="hidden md:inline">
                                    {t("employees.pagination.page", "Page")} {currentPage} {t("employees.pagination.of", "of")} {totalPages}
                                    ({filteredEmployees.length} {t("employees.pagination.total", "total employees")})
                                </span>
                                <span className="md:hidden">
                                    {currentPage}/{totalPages} ({filteredEmployees.length})
                                </span>
                            </div>
                            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 md:p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronRight className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />}
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 md:p-2 rounded-xl border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {isArabic ? <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />}
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