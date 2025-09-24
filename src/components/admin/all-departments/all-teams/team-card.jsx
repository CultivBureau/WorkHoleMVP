import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Users } from "lucide-react";

export default function TeamCard({ team }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";

    const handleViewDetails = () => {
        // Navigation for viewing team details - you can implement this later
        console.log("View team details:", team.id);
    };

    return (
        <div 
            className="bg-[var(--bg-color)] rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 cursor-pointer"
            dir={isArabic ? "rtl" : "ltr"}
            onClick={handleViewDetails}
        >
            {/* Team Header */}
            <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                        <Users className="text-white" size={20} />
                    </div>
                    <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-semibold text-[var(--text-color)]">
                            {team.name}
                        </h3>
                        <p className="text-sm text-[var(--sub-text-color)]">
                            {team.totalMembers} {t("allTeams.teamCard.members")}
                        </p>
                    </div>
                </div>
                
                {/* Member Avatars */}
                <div className={`flex items-center gap-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {team.memberAvatars?.slice(0, 3).map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar}
                            alt={`Member ${index + 1}`}
                            className="w-8 h-8 rounded-full border-2 border-[var(--bg-color)]"
                            style={{ marginLeft: isArabic ? '0' : index > 0 ? '-8px' : '0', marginRight: isArabic ? index > 0 ? '-8px' : '0' : '0' }}
                        />
                    ))}
                    {team.totalMembers > 3 && (
                        <div className="w-8 h-8 rounded-full bg-[var(--container-color)] border-2 border-[var(--bg-color)] flex items-center justify-center text-xs font-medium text-[var(--sub-text-color)]"
                             style={{ marginLeft: isArabic ? '0' : '-8px', marginRight: isArabic ? '-8px' : '0' }}>
                            +{team.totalMembers - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* Team Lead Header with View All */}
            <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <img
                        src={team.leadAvatar || "/assets/navbar/Avatar.png"}
                        alt={team.lead}
                        className="w-8 h-8 rounded-full"
                    />
                    <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-medium text-[var(--text-color)]">
                            {team.lead}
                        </p>
                        <p className="text-xs text-[var(--sub-text-color)]">
                            {team.leadRole || "Sr. Project Manager"}
                        </p>
                    </div>
                </div>
                
                <button className={`text-sm text-[var(--accent-color)] hover:text-[var(--accent-hover-color)] transition-colors ${isArabic ? 'text-right' : 'text-left'}`}>
                    {t("allTeams.teamCard.view", "View All")}
                </button>
            </div>

            {/* Team Members List */}
            <div className="space-y-3">
                {team.members?.slice(0, 5).map((member, index) => (
                    <div 
                        key={index}
                        className={`flex items-center justify-between p-3 bg-[var(--container-color)] rounded-lg hover:bg-[var(--hover-color)] transition-colors cursor-pointer ${isArabic ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                                <p className="text-sm font-medium text-[var(--text-color)]">
                                    {member.name}
                                </p>
                                <p className="text-xs text-[var(--sub-text-color)]">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                        
                        <ChevronRight size={14} className={`text-[var(--sub-text-color)] ${isArabic ? 'rotate-180' : ''}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
