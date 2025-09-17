import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";

const EmployeeCard = ({
    name = "Layla wael",
    position = "UX UI Designer",
    department = "Design",
    joinDate = "2/4/2024",
    status = "Active",
    avatar = "https://i.pravatar.cc/150?img=1",
    onCardClick,
    className = ""
}) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const textAlign = isArabic ? "text-right" : "text-left";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "active":
                return {
                    bg: "#dcfce7",
                    text: "#059669",
                    border: "#bbf7d0"
                };
            case "inactive":
                return {
                    bg: "#fef2f2",
                    text: "#dc2626",
                    border: "#fecaca"
                };
            case "pending":
                return {
                    bg: "#fef3c7",
                    text: "#d97706",
                    border: "#fde68a"
                };
            default:
                return {
                    bg: "#f3f4f6",
                    text: "#6b7280",
                    border: "#d1d5db"
                };
        }
    };

    const statusColors = getStatusColor(status);

    // Handle action clicks
    const handleView = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(false);
        console.log("View employee:", name);
        // Add your view logic here
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(false);
        console.log("Edit employee:", name);
        // Add your edit logic here
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(false);
        console.log("Delete employee:", name);
        // Add your delete logic here
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div
            className={`relative rounded-xl p-3 border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] flex flex-col justify-between ${className}`}
            style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                height: '100%', // Use full height of grid cell
                minHeight: '200px',
                maxHeight: '200px',
                overflow: 'hidden'
            }}
            onClick={onCardClick}
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Three dots menu */}
            <div className={`absolute top-2 z-10 ${isArabic ? 'left-2' : 'right-2'}`} ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    style={{
                        color: 'var(--sub-text-color)',
                        backgroundColor: isDropdownOpen ? 'var(--table-header-bg)' : 'transparent'
                    }}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div
                        className={`absolute top-8 ${isArabic ? 'left-0' : 'right-0'} mt-1 w-32 rounded-lg border shadow-lg z-20`}
                        style={{
                            backgroundColor: 'var(--bg-color)',
                            borderColor: 'var(--border-color)'
                        }}
                    >
                        <div className="py-1">
                            <button
                                onClick={handleView}
                                className={`w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                <Eye className="w-3 h-3" />
                                {t("employees.actions.view", "View")}
                            </button>
                            <button
                                onClick={handleEdit}
                                className={`w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                <Edit className="w-3 h-3" />
                                {t("employees.actions.edit", "Edit")}
                            </button>
                            <button
                                onClick={handleDelete}
                                className={`w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-red-50 transition-colors ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                                style={{ color: '#ef4444' }}
                            >
                                <Trash2 className="w-3 h-3" />
                                {t("employees.actions.delete", "Delete")}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Top Section: Avatar + Name + Position */}
            <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                        <img
                            src={avatar}
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=15919B&color=fff&size=48`;
                            }}
                        />
                    </div>
                </div>

                {/* Name */}
                <div className="text-center mb-1">
                    <h3
                        className={`text-sm font-semibold ${textAlign} truncate max-w-full`}
                        style={{ color: 'var(--text-color)' }}
                        title={name}
                    >
                        {name}
                    </h3>
                </div>

                {/* Position */}
                <div className="text-center mb-4">
                    <p
                        className={`text-xs ${textAlign} truncate max-w-full`}
                        style={{ color: 'var(--sub-text-color)' }}
                        title={position}
                    >
                        {position}
                    </p>
                </div>
            </div>

            {/* Middle Section: Details */}
            <div className="flex-1 space-y-2">
                {/* Department */}
                <div className={`flex justify-between items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span
                        className={`text-xs font-medium ${textAlign} flex-shrink-0`}
                        style={{ color: 'var(--text-color)' }}
                    >
                        {t("employees.department", "Department")}
                    </span>
                    <span
                        className={`text-xs ${textAlign} truncate ml-2 max-w-[80px]`}
                        style={{ color: 'var(--sub-text-color)' }}
                        title={department}
                    >
                        {department}
                    </span>
                </div>

                {/* Join Date */}
                <div className={`flex justify-between items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span
                        className={`text-xs font-medium ${textAlign} flex-shrink-0`}
                        style={{ color: 'var(--text-color)' }}
                    >
                        {t("employees.joinDate", "Join Date")}
                    </span>
                    <span
                        className={`text-xs ${textAlign}`}
                        style={{ color: 'var(--sub-text-color)' }}
                    >
                        {joinDate}
                    </span>
                </div>
            </div>

            {/* Bottom Section: Status Badge */}
            <div className="flex justify-center mt-1 mb-3">
                <span
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        borderColor: statusColors.border
                    }}
                >
                    {t(`employees.status.${status.toLowerCase()}`, status)}
                </span>
            </div>
        </div>
    );
};

export default EmployeeCard;