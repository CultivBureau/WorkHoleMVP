import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronDown, Check, Save, Users, UserCheck } from "lucide-react";

export default function EditTeamModal({ isOpen, onClose, onUpdateTeam, teamData }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [editTeam, setEditTeam] = useState({ 
        name: '', 
        description: '', 
        selectedEmployees: [],
        teamLeader: null
    });
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const [isLeaderDropdownOpen, setIsLeaderDropdownOpen] = useState(false);

    // Mock employee data
    const employees = [
        { id: 1, name: "Alice Johnson", role: "UX Designer", avatar: "/assets/navbar/Avatar.png" },
        { id: 2, name: "Bob Smith", role: "UI Designer", avatar: "/assets/navbar/Avatar.png" },
        { id: 3, name: "Carol Davis", role: "UX Researcher", avatar: "/assets/navbar/Avatar.png" },
        { id: 4, name: "David Wilson", role: "Product Designer", avatar: "/assets/navbar/Avatar.png" },
        { id: 5, name: "Emily Chen", role: "Senior Designer", avatar: "/assets/navbar/Avatar.png" },
        { id: 6, name: "Frank Miller", role: "Design Lead", avatar: "/assets/navbar/Avatar.png" }
    ];

    // Team leaders can be selected from employees or could be a separate list
    const teamLeaders = employees.filter(emp => 
        emp.role.includes("Lead") || 
        emp.role.includes("Senior") || 
        emp.role.includes("Manager")
    );

    // Pre-populate form when teamData changes
    useEffect(() => {
        if (teamData && isOpen) {
            // Find team leader from employees based on team data
            const leader = employees.find(emp => emp.name === teamData.lead) || null;
            
            setEditTeam({
                name: teamData.name || '',
                description: teamData.description || '',
                selectedEmployees: teamData.members || [],
                teamLeader: leader
            });
        }
    }, [teamData, isOpen]);

    const toggleEmployee = (employee) => {
        setEditTeam(prev => ({
            ...prev,
            selectedEmployees: prev.selectedEmployees.find(e => e.id === employee.id)
                ? prev.selectedEmployees.filter(e => e.id !== employee.id)
                : [...prev.selectedEmployees, employee]
        }));
    };

    const selectTeamLeader = (leader) => {
        setEditTeam(prev => ({
            ...prev,
            teamLeader: leader
        }));
        setIsLeaderDropdownOpen(false);
    };

    const handleUpdateTeam = () => {
        if (editTeam.name.trim()) {
            const updatedTeamData = {
                ...teamData,
                name: editTeam.name,
                description: editTeam.description,
                lead: editTeam.teamLeader?.name || teamData.lead,
                leadAvatar: editTeam.teamLeader?.avatar || teamData.leadAvatar,
                leadRole: editTeam.teamLeader?.role || teamData.leadRole,
                totalMembers: editTeam.selectedEmployees.length,
                memberAvatars: editTeam.selectedEmployees.slice(0, 3).map(emp => emp.avatar),
                members: editTeam.selectedEmployees,
                teamLeader: editTeam.teamLeader
            };
            
            onUpdateTeam(updatedTeamData);
            onClose();
        }
    };

    const handleCancel = () => {
        // Reset form to original data
        if (teamData) {
            const leader = employees.find(emp => emp.name === teamData.lead) || null;
            setEditTeam({
                name: teamData.name || '',
                description: teamData.description || '',
                selectedEmployees: teamData.members || [],
                teamLeader: leader
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div 
                className="bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                dir={isArabic ? "rtl" : "ltr"}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-bold text-[var(--text-color)]">
                        Edit Team
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                    >
                        <X className="text-[var(--sub-text-color)]" size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)] space-y-4 m-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="form-input"
                            placeholder={t("departments.newDepartmentForm.setupTeams.teamName")}
                            type="text"
                            value={editTeam.name}
                            onChange={(e) => setEditTeam(prev => ({ ...prev, name: e.target.value }))}
                        />
                        
                        {/* Team Leader Dropdown */}
                        <div className="relative">
                            <div
                                className="form-input cursor-pointer flex items-center justify-between"
                                onClick={() => setIsLeaderDropdownOpen(!isLeaderDropdownOpen)}
                            >
                                {editTeam.teamLeader ? (
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={editTeam.teamLeader.avatar} 
                                            alt={editTeam.teamLeader.name} 
                                            className="w-6 h-6 rounded-full" 
                                        />
                                        <div>
                                            <div className="text-[var(--text-color)] font-medium text-sm">
                                                {editTeam.teamLeader.name}
                                            </div>
                                            <div className="text-[var(--sub-text-color)] text-xs">
                                                {editTeam.teamLeader.role}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-[var(--sub-text-color)]">
                                        Choose Team Leader
                                    </span>
                                )}
                                <ChevronDown 
                                    className={`text-[var(--sub-text-color)] transition-transform ${isLeaderDropdownOpen ? 'rotate-180' : ''}`} 
                                    size={16} 
                                />
                            </div>
                            
                            {isLeaderDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {teamLeaders.map(leader => (
                                        <div
                                            key={leader.id}
                                            className="p-3 hover:bg-[var(--hover-color)] cursor-pointer flex items-center justify-between"
                                            onClick={() => selectTeamLeader(leader)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={leader.avatar} alt={leader.name} className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <div className="text-[var(--text-color)] font-medium">{leader.name}</div>
                                                    <div className="text-[var(--sub-text-color)] text-sm">{leader.role}</div>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded border-2 ${
                                                editTeam.teamLeader?.id === leader.id 
                                                    ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                                                    : 'border-[var(--border-color)]'
                                            } flex items-center justify-center`}>
                                                {editTeam.teamLeader?.id === leader.id && (
                                                    <Check className="text-white" size={12} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Team Members - Full Width */}
                    <div className="relative">
                        <div
                            className="form-input cursor-pointer flex items-center justify-between"
                            onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                        >
                            <span className="text-[var(--sub-text-color)]">
                                {editTeam.selectedEmployees.length > 0 
                                    ? `${editTeam.selectedEmployees.length} selected`
                                    : t("departments.newDepartmentForm.setupTeams.chooseEmployee")
                                }
                            </span>
                            <div className="flex items-center gap-2">
                                {editTeam.selectedEmployees.slice(0, 3).map(emp => (
                                    <img key={emp.id} src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full" />
                                ))}
                                {editTeam.selectedEmployees.length > 3 && (
                                    <span className="text-xs text-[var(--sub-text-color)]">+{editTeam.selectedEmployees.length - 3}</span>
                                )}
                                <ChevronDown 
                                    className={`text-[var(--sub-text-color)] transition-transform ${isEmployeeDropdownOpen ? 'rotate-180' : ''}`} 
                                    size={16} 
                                />
                            </div>
                        </div>
                        
                        {isEmployeeDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {employees.map(employee => (
                                    <div
                                        key={employee.id}
                                        className="p-3 hover:bg-[var(--hover-color)] cursor-pointer flex items-center justify-between"
                                        onClick={() => toggleEmployee(employee)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <div className="text-[var(--text-color)] font-medium">{employee.name}</div>
                                                <div className="text-[var(--sub-text-color)] text-sm">{employee.role}</div>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded border-2 ${
                                            editTeam.selectedEmployees.find(e => e.id === employee.id) 
                                                ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                                                : 'border-[var(--border-color)]'
                                        } flex items-center justify-center`}>
                                            {editTeam.selectedEmployees.find(e => e.id === employee.id) && (
                                                <Check className="text-white" size={12} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Team Description - Full Width */}
                    <textarea
                        className="form-input w-full"
                        placeholder={t("departments.newDepartmentForm.setupTeams.description")}
                        rows="3"
                        value={editTeam.description}
                        onChange={(e) => setEditTeam(prev => ({ ...prev, description: e.target.value }))}
                    />
                    
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn-primary flex items-center gap-2"
                            onClick={handleUpdateTeam}
                            disabled={!editTeam.name.trim()}
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
