import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, Plus, ArrowLeft } from "lucide-react";
import TeamCard from "./team-card";
import TeamsStatusCards from "./status-cards";
import AddTeamModal from "./add-team";
import EditTeamModal from "./edit-team";

// Mock teams data
const initialTeamsData = [
        {
            id: 1,
            name: "UX Team",
            department: "Design Department",
            lead: "Leslie Alexander",
            leadAvatar: "/assets/navbar/Avatar.png",
            leadRole: "Sr. Project Manager",
            totalMembers: 5,
            tasks: 12,
            performance: "92%",
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            members: [
                { name: "Leslie Alexander", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Ronald Richards", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Savannah Nguyen", role: "Project Manager", avatar: "/assets/navbar/Avatar.png", status: "offline" },
                { name: "Eleanor Pena", role: "Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Esther Howard", role: "Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" }
            ]
        },
        {
            id: 2,
            name: "UI Team",
            department: "Design Department",
            lead: "Leslie Alexander",
            leadAvatar: "/assets/navbar/Avatar.png",
            leadRole: "Sr. Project Manager",
            totalMembers: 5,
            tasks: 8,
            performance: "88%",
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            members: [
                { name: "Leslie Alexander", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Ronald Richards", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "offline" },
                { name: "Savannah Nguyen", role: "Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Eleanor Pena", role: "Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Esther Howard", role: "Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" }
            ]
        },
        {
            id: 3,
            name: "graphic design Team",
            department: "Design Department",
            lead: "Leslie Alexander",
            leadAvatar: "/assets/navbar/Avatar.png",
            leadRole: "Sr. Project Manager",
            totalMembers: 5,
            tasks: 6,
            performance: "85%",
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            members: [
                { name: "Leslie Alexander", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Ronald Richards", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" }
            ]
        },
        {
            id: 4,
            name: "UX Team",
            department: "Design Department",
            lead: "Leslie Alexander",
            leadAvatar: "/assets/navbar/Avatar.png",
            leadRole: "Sr. Project Manager", 
            totalMembers: 5,
            tasks: 5,
            performance: "90%",
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            members: [
                { name: "Leslie Alexander", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" },
                { name: "Ronald Richards", role: "Sr. Project Manager", avatar: "/assets/navbar/Avatar.png", status: "online" }
            ]
        },
    ];

export default function AllTeams() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
    const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teams, setTeams] = useState(initialTeamsData);
    const navigate = useNavigate();

    const handleAddNewTeam = () => {
        setIsAddTeamModalOpen(true);
    };

    const handleAddTeam = (teamData) => {
        const newTeam = {
            ...teamData,
            department: "Design Department",
            lead: teamData.teamLeader?.name || "Unknown",
            leadAvatar: teamData.teamLeader?.avatar || "/assets/navbar/Avatar.png",
            leadRole: teamData.teamLeader?.role || "Team Lead",
            totalMembers: teamData.selectedEmployees.length,
            tasks: Math.floor(Math.random() * 15) + 1,
            performance: `${Math.floor(Math.random() * 20) + 80}%`,
            memberAvatars: teamData.selectedEmployees.slice(0, 3).map(emp => emp.avatar),
            members: teamData.selectedEmployees
        };
        setTeams(prev => [...prev, newTeam]);
    };

    const handleEditTeam = (team) => {
        setSelectedTeam(team);
        setIsEditTeamModalOpen(true);
    };

    const handleUpdateTeam = (updatedTeam) => {
        setTeams(prev => prev.map(team => 
            team.id === updatedTeam.id ? updatedTeam : team
        ));
        setIsEditTeamModalOpen(false);
        setSelectedTeam(null);
    };

    const handleDeleteTeam = (teamId) => {
        // Add confirmation dialog here if needed
        setTeams(prev => prev.filter(team => team.id !== teamId));
    };

    const handleGoBack = () => {
        navigate('/pages/admin/all-departments');
    };

    // Filter teams based on search term
    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.members.some(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
            {/* Header with Back Button */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
                <button 
                    onClick={handleGoBack}
                    className={`flex items-center gap-2 text-[var(--accent-color)] hover:text-[var(--accent-hover-color)] transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                    <ArrowLeft size={20} className={`${isArabic ? 'rotate-180' : ''}`} />
                    <span className="font-medium text-sm sm:text-base">All Department</span>
                </button>
                <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                    <span className="text-sm text-[var(--sub-text-color)]">Teams</span>
                </div>
            </div>

            {/* Status Cards */}
            <TeamsStatusCards />

            {/* Search and Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search
                        className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 ${isArabic ? 'right-3' : 'left-3'}`}
                        style={{ color: 'var(--sub-text-color)' }}
                    />
                    <input
                        type="text"
                        placeholder={t("allTeams.search.placeholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                        style={{
                            borderColor: 'var(--border-color)',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-color)',
                            paddingLeft: isArabic ? '16px' : '40px',
                            paddingRight: isArabic ? '40px' : '16px',
                            focusRingColor: 'var(--accent-color)',
                            textAlign: isArabic ? 'right' : 'left'
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div className={` ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <button 
                        onClick={handleAddNewTeam}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">{t("allTeams.search.addNewTeam")}</span>
                    </button>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                        <TeamCard 
                            key={team.id} 
                            team={team} 
                            onEdit={handleEditTeam}
                            onDelete={handleDeleteTeam}
                        />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-[var(--container-color)] rounded-full flex items-center justify-center mb-4">
                            <Search className="text-[var(--sub-text-color)]" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-color)] mb-2">
                            No teams found
                        </h3>
                        <p className="text-[var(--sub-text-color)] max-w-sm">
                            {searchTerm 
                                ? `No teams match "${searchTerm}". Try adjusting your search.`
                                : "No teams available at the moment."
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            {searchTerm && filteredTeams.length > 0 && (
                <div className={`text-sm text-[var(--sub-text-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                    Showing {filteredTeams.length} of {teams.length} teams
                </div>
            )}

            {/* Add Team Modal */}
            <AddTeamModal 
                isOpen={isAddTeamModalOpen}
                onClose={() => setIsAddTeamModalOpen(false)}
                onAddTeam={handleAddTeam}
            />

            {/* Edit Team Modal */}
            <EditTeamModal
                isOpen={isEditTeamModalOpen}
                onClose={() => {
                    setIsEditTeamModalOpen(false);
                    setSelectedTeam(null);
                }}
                onUpdateTeam={handleUpdateTeam}
                teamData={selectedTeam}
            />
        </div>
    );
}
