import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Edit, Trash2, MoreVertical } from "lucide-react";
import GroupDepartmentIcon from '/assets/groupDepartments.svg';

export default function DepartmentCard({ department }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleEditDepartment = (e) => {
        e.stopPropagation(); // Prevent card click
        setIsMenuOpen(false);
        navigate(`/pages/admin/edit-department/${department.id}`);
    };

    const handleDeleteDepartment = (e) => {
        e.stopPropagation(); // Prevent card click
        setIsMenuOpen(false);
        // Add delete confirmation logic here
        console.log("Delete department:", department.id);
    };

    const handleMenuToggle = (e) => {
        e.stopPropagation(); // Prevent card click
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCardClick = () => {
        navigate('/pages/admin/all-teams');
    };

    return (
        <div
            className="bg-[var(--bg-color)] rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 cursor-pointer"
            dir={isArabic ? "rtl" : "ltr"}
            onClick={handleCardClick}
        >
            {/* Department Header */}
            <div className={`flex items-start justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-semibold text-[var(--text-color)]">
                            {department.name}
                        </h3>
                        <p className="text-sm text-[var(--sub-text-color)]">
                            {department.totalMembers} {t("allDepartments.departmentCard.members")}
                        </p>
                    </div>
                </div>

                {/* Avatars and Three Dot Menu */}
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {/* Member Avatars */}
                    <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {department.memberAvatars?.slice(0, 3).map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Member ${index + 1}`}
                                className="w-8 h-8 rounded-full border-2 border-[var(--bg-color)]"
                                style={{ marginLeft: isArabic ? '0' : index > 0 ? '-8px' : '0', marginRight: isArabic ? index > 0 ? '-8px' : '0' : '0' }}
                            />
                        ))}
                        {department.totalMembers > 3 && (
                            <div className="w-8 h-8 rounded-full bg-[var(--container-color)] border-2 border-[var(--bg-color)] flex items-center justify-center text-xs font-medium text-[var(--sub-text-color)]"
                                style={{ marginLeft: isArabic ? '0' : '-8px', marginRight: isArabic ? '-8px' : '0' }}>
                                +{department.totalMembers - 3}
                            </div>
                        )}
                    </div>

                    {/* Three Dot Menu */}
                    <div className="relative">
                        <button
                            onClick={handleMenuToggle}
                            className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                        >
                            <MoreVertical className="text-[var(--sub-text-color)]" size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className={`absolute top-full mt-1 w-32 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 ${isArabic ? 'right-0' : 'left-0'}`}>
                                <button
                                    onClick={handleEditDepartment}
                                    className="w-full px-3 py-2 text-left hover:bg-[var(--hover-color)] transition-colors flex items-center gap-2 text-[var(--text-color)]"
                                >
                                    <Edit size={14} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={handleDeleteDepartment}
                                    className="w-full px-3 py-2 text-left hover:bg-[var(--hover-color)] transition-colors flex items-center gap-2 text-red-500"
                                >
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-[var(--border-color)]" />
            {/* Teams Count */}
            <div className={`flex items-center my-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-[var(--sub-text-color)]">
                    {department.teams?.length || 0} {t("allDepartments.departmentCard.teams")}
                </span>
            </div>

            {/* Teams List */}
            <div className="space-y-3">
                {department.teams?.slice(0, 4).map((team, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-3 bg-[var(--bg-color)] rounded-lg hover:bg-[var(--hover-color)] transition-colors cursor-pointer ${isArabic ? 'flex-row-reverse' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/pages/admin/all-teams');
                        }}
                    >
                        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 bg-[var(--menu-active-bg)] rounded-full flex items-center justify-center">
                                <img src={GroupDepartmentIcon} alt="Group Department" className="w-7 h-7" />
                            </div>
                            <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                                <p className="text-sm font-medium text-[var(--text-color)]">
                                    {team.name}
                                </p>
                                <p className="text-xs text-[var(--sub-text-color)]">
                                    {team.description}
                                </p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <span className="text-sm font-medium text-[var(--sub-text-color)]">
                                {team.memberCount} {t("allDepartments.departmentCard.members")}
                            </span>
                            <ChevronRight size={14} className={`text-[var(--sub-text-color)] ${isArabic ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
