import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Users, Edit, Trash2, MoreVertical } from "lucide-react";
import TeamDetailsPopup from "./team-details/team-details-popup";

export default function TeamCard({ team, onEdit, onDelete }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    const handleViewDetails = () => {
        setShowDetailsPopup(true);
    };

    const handleEditTeam = (e) => {
        e.stopPropagation(); // Prevent card click
        setIsMenuOpen(false);
        if (onEdit) {
            onEdit(team);
        }
    };

    const handleDeleteTeam = (e) => {
        e.stopPropagation(); // Prevent card click
        setIsMenuOpen(false);
        if (onDelete) {
            onDelete(team.id);
        }
    };

    const handleMenuToggle = (e) => {
        e.stopPropagation(); // Prevent card click
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div 
            className="bg-[var(--bg-color)] rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 cursor-pointer"
            dir={isArabic ? "rtl" : "ltr"}
            onClick={handleViewDetails}
        >
            {/* Team Header */}
            <div className={`flex items-start justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                        <Users className="text-white" size={20} />
                    </div>
                    <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-semibold text-[var(--text-color)]">
                            {team.name}
                        </h3>
                        <p className="text-sm text-[var(--sub-text-color)]">
                            {(team.members?.length || 0) + 1} {t("allTeams.teamCard.members")}
                        </p>
                    </div>
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
                                onClick={handleEditTeam}
                                className="w-full px-3 py-2 text-left hover:bg-[var(--hover-color)] transition-colors flex items-center gap-2 text-[var(--text-color)]"
                            >
                                <Edit size={14} />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={handleDeleteTeam}
                                className="w-full px-3 py-2 text-left hover:bg-[var(--hover-color)] transition-colors flex items-center gap-2 text-red-500"
                            >
                                <Trash2 size={14} />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Member Avatars */}
            <div className={`flex items-center gap-1 mb-4 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                {team.memberAvatars?.slice(0, 4).map((avatar, index) => (
                    <img
                        key={index}
                        src={avatar}
                        alt={`Member ${index + 1}`}
                        className="w-8 h-8 rounded-full border-2 border-[var(--bg-color)]"
                        style={{ marginLeft: isArabic ? '0' : index > 0 ? '-8px' : '0', marginRight: isArabic ? index > 0 ? '-8px' : '0' : '0' }}
                    />
                ))}
                {((team.members?.length || 0) + 1) > 4 && (
                    <div className="w-8 h-8 rounded-full bg-[var(--container-color)] border-2 border-[var(--bg-color)] flex items-center justify-center text-xs font-medium text-[var(--sub-text-color)]"
                         style={{ marginLeft: isArabic ? '0' : '-8px', marginRight: isArabic ? '-8px' : '0' }}>
                        +{((team.members?.length || 0) + 1) - 4}
                    </div>
                )}
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
                {team.members?.slice(0, 3).map((member, index) => (
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

            {/* Team Details Popup */}
            <TeamDetailsPopup 
                isOpen={showDetailsPopup}
                onClose={() => setShowDetailsPopup(false)}
                team={team}
            />
        </div>
    );
}
