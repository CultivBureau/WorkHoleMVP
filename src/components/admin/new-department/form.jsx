import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Users, UserCheck, Eye, ChevronDown, X, Plus, Check } from "lucide-react";
import { useGetAllRolesQuery, useGetRoleUsersQuery } from "../../../services/apis/RoleApi";
import { useCreateDepartmentMutation, useAssignSupervisorMutation } from "../../../services/apis/DepartmentApi";
import { useCreateTeamMutation } from "../../../services/apis/TeamApi";

export default function NewDepartmentForm() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [step, setStep] = useState(0);
    const [departmentInfo, setDepartmentInfo] = useState({ departmentName: '', description: '' });
    const [supervisor, setSupervisor] = useState(null);
    const [teams, setTeams] = useState([]);

    const steps = [
        { label: t("departments.newDepartmentForm.steps.departmentInfo"), icon: Building2 },
        { label: t("departments.newDepartmentForm.steps.assignSupervisor"), icon: UserCheck },
        { label: t("departments.newDepartmentForm.steps.setupTeams"), icon: Users },
        { label: t("departments.newDepartmentForm.steps.reviewAndDone"), icon: Eye },
    ];

    return (
        <div className="w-full mx-auto bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]" dir={isArabic ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)]">
                <h1
                    className={`text-2xl font-bold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}
                >
                    {t("departments.newDepartmentForm.title")}
                </h1>

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
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isArabic ? 'ml-2' : 'mr-2'} ${isActive || isCompleted ? 'gradient-bg text-white' :
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
                    {step === 0 && (
                        <DepartmentInfoStep
                            value={departmentInfo}
                            onChange={setDepartmentInfo}
                            onNext={() => setStep(1)}
                        />
                    )}
                    {step === 1 && (
                        <AssignSupervisorStep
                            selectedUser={supervisor}
                            setSelectedUser={setSupervisor}
                            onNext={() => setStep(2)}
                            onBack={() => setStep(0)}
                        />
                    )}
                    {step === 2 && (
                        <SetupTeamsStep
                            teams={teams}
                            setTeams={setTeams}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <ReviewStep
                            departmentInfo={departmentInfo}
                            supervisor={supervisor}
                            teams={teams}
                            onBack={() => setStep(2)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Step 1: Department Information
function DepartmentInfoStep({ onNext, value, onChange }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [formData, setFormData] = useState(value || { departmentName: '', description: '' });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // propagate up when formData changes
    React.useEffect(() => {
        onChange && onChange(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    return (
        <div className="space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    className="form-input"
                    placeholder={t("departments.newDepartmentForm.departmentInfo.departmentName")}
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => handleInputChange('departmentName', e.target.value)}
                />
                {/* shortName removed per API schema */}
                <textarea
                    className="form-input md:col-span-1"
                    placeholder={t("departments.newDepartmentForm.departmentInfo.description")}
                    rows="4"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
                {/* status field removed per request */}
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary">{t("departments.newDepartmentForm.buttons.cancel")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("departments.newDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 2: Assign Supervisor
function AssignSupervisorStep({ onNext, onBack, selectedUser, setSelectedUser }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    // selectedUser managed by parent

    const { data: rolesData, isLoading: isLoadingRoles, isError: isErrorRoles, refetch: refetchRoles } = useGetAllRolesQuery({ pageNumber: 1, pageSize: 50 });
    const { data: roleUsersData, isLoading: isLoadingUsers, isError: isErrorUsers, refetch: refetchUsers } = useGetRoleUsersQuery(
        selectedRole ? { id: selectedRole.id, pageNumber: 1, pageSize: 50 } : { id: "", pageNumber: 1, pageSize: 50 },
        { skip: !selectedRole }
    );

    const roles = Array.isArray(rolesData?.value) ? rolesData.value : (Array.isArray(rolesData?.data) ? rolesData.data : (Array.isArray(rolesData?.items) ? rolesData.items : (Array.isArray(rolesData) ? rolesData : [])));
    const users = Array.isArray(roleUsersData?.value) ? roleUsersData.value : (Array.isArray(roleUsersData?.data) ? roleUsersData.data : (Array.isArray(roleUsersData?.items) ? roleUsersData.items : (Array.isArray(roleUsersData) ? roleUsersData : [])));

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
                        {isLoadingRoles && <div className="p-3 text-[var(--sub-text-color)]">Loading roles...</div>}
                        {isErrorRoles && (
                            <div className="p-3 text-[var(--sub-text-color)] flex items-center justify-between">
                                <span>Failed to load roles</span>
                                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); refetchRoles(); }}>Retry</button>
                            </div>
                        )}
                        {roles.map((role) => (
                            <div key={role.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setSelectedRole(role); setIsRoleOpen(false); setSelectedUser(null); }}>
                                <div className="text-sm text-[var(--text-color)]">{role.name}</div>
                            </div>
                        ))}
                        {roles.length === 0 && !isLoadingRoles && !isErrorRoles && (
                            <div className="p-3 text-[var(--sub-text-color)]">No roles found</div>
                        )}
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
                        {selectedRole && isLoadingUsers && <div className="p-3 text-[var(--sub-text-color)]">Loading users...</div>}
                        {selectedRole && isErrorUsers && (
                            <div className="p-3 text-[var(--sub-text-color)] flex items-center justify-between">
                                <span>Failed to load users</span>
                                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); refetchUsers(); }}>Retry</button>
                            </div>
                        )}
                        {selectedRole && users.map((u) => (
                            <div key={u.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setSelectedUser(u); setIsUserOpen(false); }}>
                                <div className="text-sm text-[var(--text-color)]">{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()}</div>
                                <div className="text-xs text-[var(--sub-text-color)]">{u.email || u.username}</div>
                            </div>
                        ))}
                        {selectedRole && users.length === 0 && !isLoadingUsers && !isErrorUsers && (
                            <div className="p-3 text-[var(--sub-text-color)]">No users found for this role</div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>{t("departments.newDepartmentForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext} disabled={!selectedUser}>{t("departments.newDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 3: Setup Teams
function SetupTeamsStep({ onNext, onBack, teams, setTeams }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', teamLeader: null, role: null });
    const [isLeaderDropdownOpen, setIsLeaderDropdownOpen] = useState(false);

    const selectTeamLeader = (leader) => {
        setNewTeam(prev => ({
            ...prev,
            teamLeader: leader
        }));
        setIsLeaderDropdownOpen(false);
    };

    const addTeam = () => {
        if (newTeam.name.trim()) {
            setTeams(prev => [...prev, {
                id: Date.now(),
                name: newTeam.name,
                description: newTeam.description,
                teamLeader: newTeam.teamLeader
            }]);
            setNewTeam({ name: '', description: '', teamLeader: null, role: null });
            setShowAddTeam(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Add New Team Form */}
            {showAddTeam && (
                <div className="p-6 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="form-input"
                            placeholder={t("departments.newDepartmentForm.setupTeams.teamName")}
                            type="text"
                            value={newTeam.name}
                            onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                        />

                    {/* Team Leader Selection: Role then User */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                            <div
                                className="form-input cursor-pointer flex items-center justify-between"
                                onClick={() => setIsLeaderDropdownOpen(!isLeaderDropdownOpen)}
                            >
                                <span className="text-[var(--sub-text-color)]">{newTeam.role ? newTeam.role.name : t("departments.newDepartmentForm.assignSupervisor.chooseRole")}</span>
                                <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isLeaderDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                            </div>
                            {isLeaderDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {/* roles list from API (reusing roles from hooks in file) */}
                                    {(Array.isArray(roles) ? roles : []).map(role => (
                                        <div key={role.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => { setNewTeam(prev => ({ ...prev, role, teamLeader: null })); setIsLeaderDropdownOpen(false); }}>
                                            <div className="text-sm text-[var(--text-color)]">{role.name}</div>
                                        </div>
                                    ))}
                                    {(!roles || roles.length === 0) && <div className="p-3 text-[var(--sub-text-color)]">No roles found</div>}
                                </div>
                            )}
                        </div>

                        {/* Users for selected role */}
                        <div className="relative">
                            <div
                                className="form-input cursor-pointer flex items-center justify-between"
                                onClick={() => newTeam.role && setIsLeaderDropdownOpen(!isLeaderDropdownOpen)}
                            >
                                <span className="text-[var(--sub-text-color)]">{newTeam.teamLeader ? (newTeam.teamLeader.name || `${newTeam.teamLeader.firstName || ''} ${newTeam.teamLeader.lastName || ''}`.trim()) : t("departments.newDepartmentForm.assignSupervisor.chooseSupervisor")}</span>
                                <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isLeaderDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                            </div>
                            {isLeaderDropdownOpen && newTeam.role && (
                                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {(Array.isArray(users) ? users : []).map(u => (
                                        <div key={u.id} className="p-3 hover:bg-[var(--hover-color)] cursor-pointer" onClick={() => selectTeamLeader(u)}>
                                            <div className="text-sm text-[var(--text-color)]">{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()}</div>
                                            <div className="text-xs text-[var(--sub-text-color)]">{u.email || u.username}</div>
                                        </div>
                                    ))}
                                    {(!users || users.length === 0) && <div className="p-3 text-[var(--sub-text-color)]">No users found</div>}
                                </div>
                            )}
                        </div>
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
                            onClick={() => setShowAddTeam(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={addTeam}
                        >
                            {t("departments.newDepartmentForm.buttons.add")}
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
                    {t("departments.newDepartmentForm.setupTeams.addNewTeam")}
                </button>
            )}

            {/* Teams List */}
            {teams.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teams.map(team => (
                            <div key={team.id} className="p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                                            <Users className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[var(--text-color)] font-medium">{team.name}</div>
                                            <div className="text-[var(--sub-text-color)] text-sm">{team.description}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--sub-text-color)]">
                                        <span className="text-sm">{t("departments.newDepartmentForm.setupTeams.membersCount", { count: 0 })}</span>
                                        <ChevronDown size={16} />
                                    </div>
                                </div>

                                {/* Team Leader Info */}
                                {team.teamLeader && (
                                    <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                                        <img
                                            src={team.teamLeader.avatar || "/assets/navbar/Avatar.png"}
                                            alt={team.teamLeader.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="text-xs text-[var(--sub-text-color)]">Team Leader</div>
                                            <div className="text-sm font-medium text-[var(--text-color)]">{(team.teamLeader?.name || `${team.teamLeader?.firstName || ''} ${team.teamLeader?.lastName || ''}`.trim())}</div>
                                        </div>
                                        <UserCheck className="text-[var(--accent-color)]" size={16} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>{t("departments.newDepartmentForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("departments.newDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 4: Review & Done
function ReviewStep({ onBack, departmentInfo, supervisor, teams }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [createDepartment] = useCreateDepartmentMutation();
    const [assignSupervisor] = useAssignSupervisorMutation();
    const [createTeam] = useCreateTeamMutation();

    const departmentData = departmentInfo || { departmentName: '', description: '' };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            // Create department
            const supervisorId = supervisor?.id || supervisor?.userId || supervisor?.userID || supervisor?.UserId;
            const payload = {
                name: departmentData.departmentName,
                description: departmentData.description,
                supervisorId: supervisorId,
            };
            const depRes = await createDepartment(payload).unwrap();
            const createdDepartment = depRes?.value || depRes;
            const departmentId = createdDepartment?.id;

            // Create teams (optional)
            if (departmentId && Array.isArray(teams) && teams.length > 0) {
                for (const team of teams) {
                    const teamPayload = {
                        name: team.name,
                        description: team.description,
                        teamLeadId: team.teamLeader?.id || team.teamLeader?.userId || team.teamLeader?.userID || team.teamLeader?.UserId,
                        departmentId,
                    };
                    try { await createTeam(teamPayload).unwrap(); } catch {}
                }
            }

            // Fallback: if backend didn't set supervisor, assign explicitly
            if (departmentId && supervisorId) {
                try { await assignSupervisor({ id: departmentId, userId: supervisorId }).unwrap(); } catch {}
            }

            setIsSubmitting(false);
            setIsCompleted(true);
        } catch (e) {
            setIsSubmitting(false);
        }
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                    <Check className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2">
                    {t("departments.newDepartmentForm.success.title")}
                </h2>
                <p className="text-[var(--sub-text-color)] mb-8">
                    {t("departments.newDepartmentForm.success.message")}
                </p>
                <button type="button" className="btn-secondary" onClick={() => window.location.href = '/pages/admin/all-departments'}>
                    {t("departments.newDepartmentForm.buttons.allDepartments")}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-[var(--text-color)]">
                {t("departments.newDepartmentForm.review.reviewDepartmentDetails")}
            </h2>

            {/* Department Information */}
            <div className="p-6 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.newDepartmentForm.review.departmentName")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.departmentName}</div>
                    </div>
                    
                    
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.newDepartmentForm.review.description")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.description}</div>
                    </div>
                </div>
            </div>

            {/* Supervisor */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-color)]">
                    {t("departments.newDepartmentForm.review.supervisor")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supervisor ? (
                        <div className="flex items-center gap-3 p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                            <img src="/assets/navbar/Avatar.png" alt={supervisor.name || supervisor.email} className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="text-[var(--text-color)] font-medium">{supervisor.name || `${supervisor.firstName || ''} ${supervisor.lastName || ''}`.trim()}</div>
                                <div className="text-[var(--sub-text-color)] text-sm">{supervisor.email || supervisor.username}</div>
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
                    {teams.map((team, index) => (
                        <div key={index} className="p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                                        <Users className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[var(--text-color)] font-medium">{team.name}</div>
                                        <div className="text-[var(--sub-text-color)] text-sm">{team.description}</div>
                                    </div>
                                </div>
                                <span className="text-[var(--sub-text-color)] text-sm">{t("departments.newDepartmentForm.setupTeams.membersCount", { count: 0 })}</span>
                            </div>

                            {/* Team Leader Info */}
                            {team.teamLeader && (
                                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                                    <img
                                        src="/assets/navbar/Avatar.png"
                                        alt={(team.teamLeader?.name || `${team.teamLeader?.firstName || ''} ${team.teamLeader?.lastName || ''}`.trim())}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="text-xs text-[var(--sub-text-color)]">Team Leader</div>
                                        <div className="text-sm font-medium text-[var(--text-color)]">{(team.teamLeader?.name || `${team.teamLeader?.firstName || ''} ${team.teamLeader?.lastName || ''}`.trim())}</div>
                                    </div>
                                    <UserCheck className="text-[var(--accent-color)]" size={16} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>
                    {t("departments.newDepartmentForm.buttons.back")}
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
    );
}
