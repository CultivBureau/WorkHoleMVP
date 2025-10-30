import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, Users, UserCheck, Eye, ChevronDown, X, Plus, Check, Save } from "lucide-react";
import { useGetAllDepartmentsQuery, useUpdateDepartmentMutation } from "../../../../services/apis/DepartmentApi";
import { useGetAllRolesQuery, useGetRoleUsersQuery } from "../../../../services/apis/RoleApi";
import { useCreateTeamMutation } from "../../../../services/apis/TeamApi";

export default function EditDepartmentForm() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const steps = [
        { label: t("departments.editDepartmentForm.steps.departmentInfo"), icon: Building2 },
        { label: t("departments.editDepartmentForm.steps.assignSupervisor"), icon: UserCheck },
        { label: t("departments.editDepartmentForm.steps.setupTeams"), icon: Users },
        { label: t("departments.editDepartmentForm.steps.reviewAndSave"), icon: Eye },
    ];

    const [departmentData, setDepartmentData] = useState({ id, name: "", description: "", teams: [] });
    const { data: depsData } = useGetAllDepartmentsQuery({ pageNumber: 1, pageSize: 100 });
    const foundDepartment = useMemo(() => {
        const items = depsData?.value || depsData?.data || depsData?.items || [];
        return Array.isArray(items) ? items.find((d) => d.id === id) : undefined;
    }, [depsData, id]);

    // Pre-fill department fields when loaded
    useEffect(() => {
        if (foundDepartment) {
            setDepartmentData((prev) => ({
                ...prev,
                name: foundDepartment.name || "",
                description: foundDepartment.description || "",
            }));
        }
    }, [foundDepartment]);

    // Supervisor selection (role -> users)
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    useEffect(() => {
        if (foundDepartment?.supervisorId) setSelectedUser({ id: foundDepartment.supervisorId });
    }, [foundDepartment]);

    const { data: rolesData } = useGetAllRolesQuery({ pageNumber: 1, pageSize: 50 });
    const roles = Array.isArray(rolesData?.value) ? rolesData.value : (Array.isArray(rolesData?.data) ? rolesData.data : (Array.isArray(rolesData) ? rolesData : []));
    const { data: roleUsersData } = useGetRoleUsersQuery(
        selectedRole ? { id: selectedRole.id, pageNumber: 1, pageSize: 50 } : { id: "", pageNumber: 1, pageSize: 50 },
        { skip: !selectedRole }
    );
    const users = Array.isArray(roleUsersData?.value) ? roleUsersData.value : (Array.isArray(roleUsersData?.data) ? roleUsersData.data : (Array.isArray(roleUsersData) ? roleUsersData : []));

    const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

    return (
        <div className="w-full mx-auto bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]" dir={isArabic ? "rtl" : "ltr"}>
            {/* Header with Breadcrumb */}
            <div className="p-6 border-b border-[var(--border-color)]">
                <h1 className="text-2xl font-bold text-[var(--text-color)] mb-2">
                    {t("departments.editDepartmentForm.title")} - {departmentData.name || ""}
                </h1>
                <div className="flex items-center text-sm text-[var(--sub-text-color)]">
                    <span>{t("departments.editDepartmentForm.breadcrumb.allDepartments")}</span>
                    <span className={`mx-2 ${isArabic ? 'rotate-180' : ''}`}>›</span>
                    <span>{t("departments.editDepartmentForm.breadcrumb.editDepartment")}</span>
                </div>
            </div>

            <div className="p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    {/* Progress Line */}
                    <div className="relative mb-4">
                        <div className="w-full h-1 bg-[var(--border-color)] rounded" />
                        <div
                            className={`absolute top-0 h-1 gradient-bg rounded transition-all duration-300 ${isArabic ? 'right-0' : 'left-0'}`}
                            style={{ width: `${((step + 1) / 4) * 100}%` }}
                        />
                    </div>

                    {/* Step Tabs */}
                    <div className="flex justify-between">
                        {steps.map((stepItem, idx) => {
                            const IconComponent = stepItem.icon;
                            const isActive = idx === step;
                            const isCompleted = idx < step;

                            return (
                                <div
                                    key={stepItem.label}
                                    className="flex items-center"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isArabic ? 'ml-2' : 'mr-2'} ${
                                        isActive || isCompleted ? 'gradient-bg text-white' :
                                        'bg-[var(--container-color)] text-[var(--sub-text-color)]'
                                    }`}>
                                        <IconComponent size={16} />
                                    </div>
                                    <span className={`text-sm font-medium hidden sm:block ${isActive || isCompleted
                                        ? 'gradient-text'
                                        : 'text-[var(--sub-text-color)]'
                                        }`}>
                                        {stepItem.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="mt-8">
                    {step === 0 && <EditDepartmentInfoStep departmentData={departmentData} setDepartmentData={setDepartmentData} onNext={() => setStep(1)} />}
                    {step === 1 && (
                        <EditAssignSupervisorStep
                            departmentData={departmentData}
                            setDepartmentData={setDepartmentData}
                            onNext={() => setStep(2)}
                            onBack={() => setStep(0)}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                            roles={roles}
                            users={users}
                            isRoleOpen={isRoleOpen}
                            setIsRoleOpen={setIsRoleOpen}
                            isUserOpen={isUserOpen}
                            setIsUserOpen={setIsUserOpen}
                            selectedRole={selectedRole}
                            setSelectedRole={setSelectedRole}
                        />
                    )}
                    {step === 2 && <EditSetupTeamsStep departmentData={departmentData} setDepartmentData={setDepartmentData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                    {step === 3 && <EditReviewStep departmentData={departmentData} selectedUser={selectedUser} onBack={() => setStep(2)} onSubmit={async () => {
                        const body = {
                            name: departmentData.name,
                            description: departmentData.description,
                            supervisorId: selectedUser?.id || selectedUser?.userId || selectedUser?.userID || selectedUser?.UserId
                        };
                        await updateDepartment({ id, ...body }).unwrap();
                    }} isSubmitting={isUpdating} />}
                </div>
            </div>
        </div>
    );
}

// Step 1: Edit Department Information
function EditDepartmentInfoStep({ departmentData, setDepartmentData, onNext }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const handleInputChange = (field, value) => {
        setDepartmentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    className="form-input"
                    placeholder={t("departments.editDepartmentForm.departmentInfo.departmentName")}
                    type="text"
                    value={departmentData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                />
                {/* shortName removed */}
                <textarea
                    className="form-input md:col-span-1"
                    placeholder={t("departments.editDepartmentForm.departmentInfo.description")}
                    rows="4"
                    value={departmentData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
                {/* status removed */}
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary">{t("departments.editDepartmentForm.buttons.cancel")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("departments.editDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 2: Edit Assign Supervisor
function EditAssignSupervisorStep({ onNext, onBack, selectedUser, setSelectedUser, roles, users, isRoleOpen, setIsRoleOpen, isUserOpen, setIsUserOpen, selectedRole, setSelectedRole }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const safeRoles = Array.isArray(roles) ? roles : [];
    const safeUsers = Array.isArray(users) ? users : [];

    return (
        <div className="space-y-6">
            {/* Role selection */}
            <div className="relative">
                <div className="form-input cursor-pointer flex items-center justify-between" onClick={() => setIsRoleOpen(!isRoleOpen)}>
                    <span className="text-[var(--sub-text-color)]">{selectedRole ? selectedRole.name : t("departments.newDepartmentForm.assignSupervisor.chooseRole")}</span>
                    <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} size={16} />
                </div>
                {isRoleOpen && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {safeRoles.map((role) => (
                            <div key={role.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setSelectedRole(role); setIsRoleOpen(false); setSelectedUser(null); }}>
                                <div className="text-sm text-[var(--text-color)]">{role.name}</div>
                            </div>
                        ))}
                        {safeRoles.length === 0 && <div className="p-3 text-[var(--sub-text-color)]">No roles found</div>}
                    </div>
                )}
            </div>

            {/* User selection */}
            <div className="relative">
                <div className="form-input cursor-pointer flex items-center justify-between" onClick={() => selectedRole && setIsUserOpen(!isUserOpen)}>
                    <span className="text-[var(--sub-text-color)]">{selectedUser ? (selectedUser.name || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()) : t("departments.newDepartmentForm.assignSupervisor.chooseSupervisor")}</span>
                    <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isUserOpen ? 'rotate-180' : ''}`} size={16} />
                </div>
                {isUserOpen && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {!selectedRole && <div className="p-3 text-[var(--sub-text-color)]">Select a role first</div>}
                        {selectedRole && safeUsers.map((u) => (
                            <div key={u.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setSelectedUser(u); setIsUserOpen(false); }}>
                                <div className="text-sm text-[var(--text-color)]">{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()}</div>
                                <div className="text-xs text-[var(--sub-text-color)]">{u.email || u.username}</div>
                            </div>
                        ))}
                        {selectedRole && safeUsers.length === 0 && <div className="p-3 text-[var(--sub-text-color)]">No users found</div>}
                    </div>
                )}
            </div>

            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>{t("departments.editDepartmentForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext} disabled={!selectedUser}>{t("departments.editDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 3: Edit Setup Teams
function EditSetupTeamsStep({ departmentData, setDepartmentData, onNext, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', selectedEmployees: [], teamLeader: null });
    const [leaderRole, setLeaderRole] = useState(null);
    const [membersRole, setMembersRole] = useState(null);
    const [isLeaderRoleOpen, setIsLeaderRoleOpen] = useState(false);
    const [isLeaderUserOpen, setIsLeaderUserOpen] = useState(false);
    const [isMembersRoleOpen, setIsMembersRoleOpen] = useState(false);
    const [isMembersOpen, setIsMembersOpen] = useState(false);

    const { data: rolesData } = useGetAllRolesQuery({ pageNumber: 1, pageSize: 50 });
    const roles = Array.isArray(rolesData?.value) ? rolesData.value : (Array.isArray(rolesData?.data) ? rolesData.data : (Array.isArray(rolesData) ? rolesData : []));

    const { data: leaderUsersData } = useGetRoleUsersQuery(
        leaderRole ? { id: leaderRole.id, pageNumber: 1, pageSize: 50 } : { id: "", pageNumber: 1, pageSize: 50 },
        { skip: !leaderRole }
    );
    const leaderUsers = Array.isArray(leaderUsersData?.value) ? leaderUsersData.value : (Array.isArray(leaderUsersData?.data) ? leaderUsersData.data : (Array.isArray(leaderUsersData) ? leaderUsersData : []));

    const { data: membersUsersData } = useGetRoleUsersQuery(
        membersRole ? { id: membersRole.id, pageNumber: 1, pageSize: 50 } : { id: "", pageNumber: 1, pageSize: 50 },
        { skip: !membersRole }
    );
    const memberUsers = Array.isArray(membersUsersData?.value) ? membersUsersData.value : (Array.isArray(membersUsersData?.data) ? membersUsersData.data : (Array.isArray(membersUsersData) ? membersUsersData : []));

    const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();

    const toggleEmployee = (user) => {
        setNewTeam(prev => ({
            ...prev,
            selectedEmployees: prev.selectedEmployees.find(e => e.id === user.id)
                ? prev.selectedEmployees.filter(e => e.id !== user.id)
                : [...prev.selectedEmployees, user]
        }));
    };

    const addTeam = async () => {
        if (!newTeam.name.trim() || !newTeam.teamLeader?.id) return;
        try {
            const res = await createTeam({
                name: newTeam.name,
                description: newTeam.description,
                teamLeadId: newTeam.teamLeader.id,
                departmentId: departmentData.id,
            }).unwrap();
            const value = res?.value || res;
            setDepartmentData(prev => ({
                ...prev,
                teams: [...prev.teams, {
                    id: value?.id || Date.now(),
                    name: value?.name || newTeam.name,
                    description: value?.description || newTeam.description,
                    members: newTeam.selectedEmployees.length
                }]
            }));
            setNewTeam({ name: '', description: '', selectedEmployees: [], teamLeader: null });
            setLeaderRole(null); setMembersRole(null);
            setShowAddTeam(false);
        } catch {}
    };

    const removeTeam = (teamId) => {
        setDepartmentData(prev => ({
            ...prev,
            teams: prev.teams.filter(team => team.id !== teamId)
        }));
    };

    return (
        <div className="space-y-6">
            {/* Add New Team Form */}
            {showAddTeam && (
                <div className="p-6 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="form-input"
                            placeholder={t("departments.editDepartmentForm.setupTeams.teamName")}
                            type="text"
                            value={newTeam.name}
                            onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                        />
                        {/* Leader role/user selection */}
                        <div className="space-y-2">
                            <div className="relative">
                                <div className="form-input cursor-pointer flex items-center justify-between" onClick={() => setIsLeaderRoleOpen(!isLeaderRoleOpen)}>
                                    <span className="text-[var(--sub-text-color)]">{leaderRole ? leaderRole.name : t("departments.newDepartmentForm.assignSupervisor.chooseRole")}</span>
                                    <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isLeaderRoleOpen ? 'rotate-180' : ''}`} size={16} />
                                </div>
                                {isLeaderRoleOpen && (
                                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {leaderRole && (leaderUsers || []).map(u => (
                                            <div key={u.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setNewTeam(prev => ({ ...prev, teamLeader: u })); setIsLeaderUserOpen(false); }}>
                                                <div className="text-sm text-[var(--text-color)]">{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()}</div>
                                                <div className="text-xs text-[var(--sub-text-color)]">{u.email || u.username}</div>
                                            </div>
                                        ))}
                                        {leaderRole && (!leaderUsers || leaderUsers.length === 0) && <div className="p-3 text-[var(--sub-text-color)]">No users found</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Members selection: role then users */}
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
                                    <span className="text-[var(--sub-text-color)]">{newTeam.selectedEmployees.length > 0 ? `${newTeam.selectedEmployees.length} selected` : t("departments.editDepartmentForm.setupTeams.chooseEmployee")}</span>
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
                    </div>
                    <textarea
                        className="form-input w-full"
                        placeholder={t("departments.editDepartmentForm.setupTeams.description")}
                        rows="3"
                        value={newTeam.description}
                        onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => setShowAddTeam(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn-primary"
                            onClick={addTeam}
                        >
                            {t("departments.editDepartmentForm.buttons.add")}
                        </button>
                    </div>
                </div>
            )}

            {/* Add New Team Button */}
            {!showAddTeam && (
                <button
                    type="button"
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setShowAddTeam(true)}
                >
                    <Plus size={16} />
                    {t("departments.editDepartmentForm.setupTeams.addNewTeam")}
                </button>
            )}

            {/* Teams List */}
            {departmentData.teams.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {departmentData.teams.map(team => (
                            <div key={team.id} className="p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                                        <Users className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[var(--text-color)] font-medium">{team.name}</div>
                                        <div className="text-[var(--sub-text-color)] text-sm">{team.description}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[var(--sub-text-color)]">{team.members} {t("departments.editDepartmentForm.setupTeams.members")}</span>
                                    <button 
                                        className="p-1 hover:bg-[var(--hover-color)] rounded"
                                        onClick={() => removeTeam(team.id)}
                                    >
                                        <X className="text-[var(--sub-text-color)]" size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>{t("departments.editDepartmentForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("departments.editDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 4: Review & Save
function EditReviewStep({ departmentData, onBack, selectedUser, onSubmit, isSubmitting }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const [isCompleted, setIsCompleted] = useState(false);
    const handleSubmit = async () => {
        try {
            await onSubmit();
            setIsCompleted(true);
        } catch (e) {}
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                    <Check className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2">
                    {t("departments.editDepartmentForm.success.title")}
                </h2>
                <p className="text-[var(--sub-text-color)] mb-8">
                    {t("departments.editDepartmentForm.success.message")}
                </p>
                <button type="button" className="btn-secondary" onClick={() => navigate('/pages/admin/all-departments')}>
                    {t("departments.editDepartmentForm.buttons.allDepartments")}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-[var(--text-color)]">
                {t("departments.editDepartmentForm.review.reviewDepartmentDetails")}
            </h2>

            {/* Department Information */}
            <div className="p-6 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.editDepartmentForm.review.departmentName")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.name}</div>
                    </div>
                    
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.editDepartmentForm.review.description")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.description}</div>
                    </div>
                </div>
            </div>

            {/* Supervisor */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-color)]">
                    {t("departments.editDepartmentForm.review.supervisor")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser ? (
                        <div className="flex items-center gap-3 p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                            <img src="/assets/navbar/Avatar.png" alt={selectedUser.name || selectedUser.email} className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="text-[var(--text-color)] font-medium">{selectedUser.name || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()}</div>
                                <div className="text-[var(--sub-text-color)] text-sm">{selectedUser.email || selectedUser.username}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-[var(--sub-text-color)]">No supervisor selected</div>
                    )}
                </div>
            </div>

            {/* Teams */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-color)]">Teams</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departmentData.teams.map((team, index) => (
                        <div key={index} className="p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                                    <Users className="text-white" size={20} />
                                </div>
                                <div>
                                    <div className="text-[var(--text-color)] font-medium">{team.name}</div>
                                    <div className="text-[var(--sub-text-color)] text-sm">{team.description}</div>
                                </div>
                            </div>
                            <span className="text-[var(--sub-text-color)] text-sm">
                                {team.members} {t("departments.editDepartmentForm.setupTeams.members")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>
                    {t("departments.editDepartmentForm.buttons.back")}
                </button>
                <button 
                    type="button" 
                    className="btn-primary flex items-center gap-2" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            {t("departments.editDepartmentForm.buttons.save")}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
