import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronDown, Plus, Check, Users } from "lucide-react";
import { useGetAllRolesQuery, useGetRoleUsersQuery } from "../../../../services/apis/RoleApi";
import { useCreateTeamMutation } from "../../../../services/apis/TeamApi";

export default function AddTeamModal({ isOpen, onClose, onAddTeam, departmentId }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [newTeam, setNewTeam] = useState({ 
        name: '', 
        description: '', 
        selectedEmployees: [],
        teamLeader: null
    });
    const [isLeaderRoleOpen, setIsLeaderRoleOpen] = useState(false);
    const [isLeaderUserOpen, setIsLeaderUserOpen] = useState(false);
    const [leaderRole, setLeaderRole] = useState(null);
    const [membersRole, setMembersRole] = useState(null);
    const [isMembersRoleOpen, setIsMembersRoleOpen] = useState(false);
    const [isMembersOpen, setIsMembersOpen] = useState(false);

    // Roles and users for leader selection
    const { data: rolesData } = useGetAllRolesQuery({ pageNumber: 1, pageSize: 50 });
    const roles = Array.isArray(rolesData?.value) ? rolesData.value : (Array.isArray(rolesData?.data) ? rolesData.data : (Array.isArray(rolesData) ? rolesData : []));
    const { data: leaderUsersData } = useGetRoleUsersQuery(
        leaderRole ? { id: leaderRole.id, pageNumber: 1, pageSize: 50 } : { id: "", pageNumber: 1, pageSize: 50 },
        { skip: !leaderRole }
    );
    const leaderUsers = Array.isArray(leaderUsersData?.value) ? leaderUsersData.value : (Array.isArray(leaderUsersData?.data) ? leaderUsersData.data : (Array.isArray(leaderUsersData) ? leaderUsersData : []));

    // Members selection via a (possibly) different role
    const { data: membersUsersData } = useGetRoleUsersQuery(
        membersRole ? { id: membersRole.id, pageNumber: 1, pageSize: 50 } : { id: "", pageNumber: 1, pageSize: 50 },
        { skip: !membersRole }
    );
    const memberUsers = Array.isArray(membersUsersData?.value) ? membersUsersData.value : (Array.isArray(membersUsersData?.data) ? membersUsersData.data : (Array.isArray(membersUsersData) ? membersUsersData : []));

    const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();

    const toggleEmployee = (employee) => {
        setNewTeam(prev => ({
            ...prev,
            selectedEmployees: prev.selectedEmployees.find(e => e.id === employee.id)
                ? prev.selectedEmployees.filter(e => e.id !== employee.id)
                : [...prev.selectedEmployees, employee]
        }));
    };

    const selectTeamLeader = (leader) => {
        setNewTeam(prev => ({ ...prev, teamLeader: leader }));
        setIsLeaderUserOpen(false);
    };

    const handleAddTeam = async () => {
        if (!newTeam.name.trim() || !departmentId || !newTeam.teamLeader?.id) return;
        try {
            const payload = {
                name: newTeam.name,
                description: newTeam.description,
                teamLeadId: newTeam.teamLeader.id,
                departmentId,
            };
            const res = await createTeam(payload).unwrap();
            const value = res?.value || res;
            onAddTeam({
                id: value?.id || Date.now(),
                name: value?.name || newTeam.name,
                description: value?.description || newTeam.description,
                teamLeader: newTeam.teamLeader,
                selectedEmployees: newTeam.selectedEmployees,
                members: newTeam.selectedEmployees.length,
            });
            setNewTeam({ name: '', description: '', selectedEmployees: [], teamLeader: null });
            onClose();
        } catch {}
    };

    const handleCancel = () => {
        // Reset form
        setNewTeam({ 
            name: '', 
            description: '', 
            selectedEmployees: [],
            teamLeader: null
        });
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
                        {t("departments.newDepartmentForm.setupTeams.addNewTeam")}
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
                            value={newTeam.name}
                            onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                        />
                        
                        {/* Team Leader: Role then User */}
                        <div className="space-y-2">
                            <div className="relative">
                                <div className="form-input cursor-pointer flex items-center justify-between" onClick={() => setIsLeaderRoleOpen(!isLeaderRoleOpen)}>
                                    <span className="text-[var(--sub-text-color)]">{leaderRole ? leaderRole.name : t("departments.newDepartmentForm.assignSupervisor.chooseRole")}</span>
                                    <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isLeaderRoleOpen ? 'rotate-180' : ''}`} size={16} />
                                </div>
                                {isLeaderRoleOpen && (
                                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {(roles || []).map(role => (
                                            <div key={role.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setLeaderRole(role); setIsLeaderRoleOpen(false); setIsLeaderUserOpen(true); }}>
                                                <div className="text-sm text-[var(--text-color)]">{role.name}</div>
                                            </div>
                                        ))}
                                        {(!roles || roles.length === 0) && <div className="p-3 text-[var(--sub-text-color)]">No roles found</div>}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <div className="form-input cursor-pointer flex items-center justify-between" onClick={() => leaderRole && setIsLeaderUserOpen(!isLeaderUserOpen)}>
                                    <span className="text-[var(--sub-text-color)]">{newTeam.teamLeader ? (newTeam.teamLeader.name || `${newTeam.teamLeader.firstName || ''} ${newTeam.teamLeader.lastName || ''}`.trim()) : t("departments.newDepartmentForm.assignSupervisor.chooseSupervisor")}</span>
                                    <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isLeaderUserOpen ? 'rotate-180' : ''}`} size={16} />
                                </div>
                                {isLeaderUserOpen && (
                                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {leaderRole && (leaderUsers || []).map(u => (
                                            <div key={u.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => selectTeamLeader(u)}>
                                                <div className="text-sm text-[var(--text-color)]">{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()}</div>
                                                <div className="text-xs text-[var(--sub-text-color)]">{u.email || u.username}</div>
                                            </div>
                                        ))}
                                        {leaderRole && (!leaderUsers || leaderUsers.length === 0) && <div className="p-3 text-[var(--sub-text-color)]">No users found</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Team Members multi-select (choose role then users) */}
                    <div className="space-y-2">
                        <div className="relative">
                            <div className="form-input cursor-pointer flex items-center justify-between" onClick={() => setIsMembersRoleOpen(!isMembersRoleOpen)}>
                                <span className="text-[var(--sub-text-color)]">{membersRole ? membersRole.name : t("departments.newDepartmentForm.assignSupervisor.chooseRole")}</span>
                                <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isMembersRoleOpen ? 'rotate-180' : ''}`} size={16} />
                            </div>
                            {isMembersRoleOpen && (
                                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {(roles || []).map(role => (
                                        <div key={role.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setMembersRole(role); setIsMembersRoleOpen(false); setIsMembersOpen(true); }}>
                                            <div className="text-sm text-[var(--text-color)]">{role.name}</div>
                                        </div>
                                    ))}
                                    {(!roles || roles.length === 0) && <div className="p-3 text-[var(--sub-text-color)]">No roles found</div>}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <div className="form-input cursor-pointer flex items-center justify-between" onClick={() => membersRole && setIsMembersOpen(!isMembersOpen)}>
                                <span className="text-[var(--sub-text-color)]">
                                    {newTeam.selectedEmployees.length > 0 ? `${newTeam.selectedEmployees.length} selected` : t("departments.newDepartmentForm.setupTeams.chooseEmployee")}
                                </span>
                                <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isMembersOpen ? 'rotate-180' : ''}`} size={16} />
                            </div>
                            {isMembersOpen && (
                                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {membersRole && (memberUsers || []).map(u => (
                                        <div key={u.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer flex items-center justify-between" onClick={() => toggleEmployee(u)}>
                                            <div className="text-sm text-[var(--text-color)]">{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()}</div>
                                            <div className="w-5 h-5 rounded border-2 border-[var(--border-color)] flex items-center justify-center">
                                                {newTeam.selectedEmployees.find(e => e.id === u.id) && <Check className="text-[var(--accent-color)]" size={12} />}
                                            </div>
                                        </div>
                                    ))}
                                    {membersRole && (!memberUsers || memberUsers.length === 0) && <div className="p-3 text-[var(--sub-text-color)]">No users found</div>}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Team Description - Full Width */}
                    <textarea
                        className="form-input w-full"
                        placeholder={t("departments.newDepartmentForm.setupTeams.description")}
                        rows="3"
                        value={newTeam.description}
                        onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
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
                            onClick={handleAddTeam}
                            disabled={!newTeam.name.trim() || !newTeam.teamLeader}
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    {t("departments.newDepartmentForm.buttons.add")}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
