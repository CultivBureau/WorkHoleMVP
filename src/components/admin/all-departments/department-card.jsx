import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Users } from "lucide-react";

export default function DepartmentCard({ department }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    return (
        <div 
            className="bg-[var(--bg-color)] rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Department Header */}
            <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                        <Users className="text-white" size={20} />
                    </div>
                    <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-semibold text-[var(--text-color)]">
                            {department.name}
                        </h3>
                        <p className="text-sm text-[var(--sub-text-color)]">
                            {department.totalMembers} {t("allDepartments.departmentCard.members")}
                        </p>
                    </div>
                </div>
                
                {/* Member Avatars */}
                <div className={`flex items-center gap-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
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
            </div>

            {/* Teams Count */}
            <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium text-[var(--text-color)]">
                    {department.teams?.length || 0} {t("allDepartments.departmentCard.teams")}
                </span>
            </div>

            {/* Teams List */}
            <div className="space-y-3">
                {department.teams?.slice(0, 4).map((team, index) => (
                    <div 
                        key={index}
                        className={`flex items-center justify-between p-3 bg-[var(--container-color)] rounded-lg hover:bg-[var(--hover-color)] transition-colors cursor-pointer ${isArabic ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                                <Users className="text-white" size={14} />
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
