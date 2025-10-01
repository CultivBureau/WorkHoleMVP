import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Users, UserCheck, Eye, ChevronDown, X, Plus, Check } from "lucide-react";

export default function NewDepartmentForm() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [step, setStep] = useState(0);

    const steps = [
        { label: t("departments.newDepartmentForm.steps.departmentInfo"), icon: Building2 },
        { label: t("departments.newDepartmentForm.steps.assignSupervisor"), icon: UserCheck },
        { label: t("departments.newDepartmentForm.steps.setupTeams"), icon: Users },
        { label: t("departments.newDepartmentForm.steps.reviewAndDone"), icon: Eye },
    ];

    return (
        <div className="w-full mx-auto bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]" dir={isArabic ? "rtl" : "ltr"}>
            {/* Header with Breadcrumb */}
            <div className="p-6 border-b border-[var(--border-color)]">
                <h1 className="text-2xl font-bold text-[var(--text-color)] mb-2">
                    {t("departments.newDepartmentForm.title")}
                </h1>
                <div className="flex items-center text-sm text-[var(--sub-text-color)]">
                    <span>{t("departments.newDepartmentForm.breadcrumb.allDepartments")}</span>
                    <span className={`mx-2 ${isArabic ? 'rotate-180' : ''}`}>›</span>
                    <span>{t("departments.newDepartmentForm.breadcrumb.addNewDepartment")}</span>
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
                    {step === 0 && <DepartmentInfoStep onNext={() => setStep(1)} />}
                    {step === 1 && <AssignSupervisorStep onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                    {step === 2 && <SetupTeamsStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                    {step === 3 && <ReviewStep onBack={() => setStep(2)} />}
                </div>
            </div>
        </div>
    );
}

// Step 1: Department Information
function DepartmentInfoStep({ onNext }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [formData, setFormData] = useState({
        departmentName: '',
        shortName: '',
        description: '',
        status: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
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
                    placeholder={t("departments.newDepartmentForm.departmentInfo.departmentName")}
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => handleInputChange('departmentName', e.target.value)}
                />
                <input
                    className="form-input"
                    placeholder={t("departments.newDepartmentForm.departmentInfo.shortName")}
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => handleInputChange('shortName', e.target.value)}
                />
                <textarea
                    className="form-input md:col-span-1"
                    placeholder={t("departments.newDepartmentForm.departmentInfo.description")}
                    rows="4"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <div className="relative">
                    <select 
                        className="form-input appearance-none cursor-pointer pr-10"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                    
                    >
                        <option value="">{t("departments.newDepartmentForm.departmentInfo.status")}</option>
                        <option value="active">{t("departments.newDepartmentForm.departmentInfo.active")}</option>
                        <option value="inactive">{t("departments.newDepartmentForm.departmentInfo.inactive")}</option>
                    </select>
                </div>
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
function AssignSupervisorStep({ onNext, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [selectedSupervisors, setSelectedSupervisors] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Mock supervisor data
    const supervisors = [
        { id: 1, name: "Leslie Alexander", role: "Senior Manager", avatar: "/assets/navbar/Avatar.png" },
        { id: 2, name: "John Doe", role: "Team Lead", avatar: "/assets/navbar/Avatar.png" },
        { id: 3, name: "Jane Smith", role: "Department Head", avatar: "/assets/navbar/Avatar.png" },
        { id: 4, name: "Mike Johnson", role: "Senior Manager", avatar: "/assets/navbar/Avatar.png" }
    ];

    const toggleSupervisor = (supervisor) => {
        setSelectedSupervisors(prev => {
            const isSelected = prev.find(s => s.id === supervisor.id);
            if (isSelected) {
                return prev.filter(s => s.id !== supervisor.id);
            } else {
                return [...prev, supervisor];
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Dropdown for selecting supervisors */}
            <div className="relative">
                <div
                    className="form-input cursor-pointer flex items-center justify-between"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className="text-[var(--sub-text-color)]">
                        {t("departments.newDepartmentForm.assignSupervisor.chooseSupervisor")}
                    </span>
                    <ChevronDown 
                        className={`text-[var(--sub-text-color)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        size={16} 
                    />
                </div>
                
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {supervisors.map(supervisor => (
                            <div
                                key={supervisor.id}
                                className="p-3 hover:bg-[var(--hover-color)] cursor-pointer flex items-center justify-between"
                                onClick={() => toggleSupervisor(supervisor)}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={supervisor.avatar} alt={supervisor.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="text-[var(--text-color)] font-medium">{supervisor.name}</div>
                                        <div className="text-[var(--sub-text-color)] text-sm">{supervisor.role}</div>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded border-2 ${
                                    selectedSupervisors.find(s => s.id === supervisor.id) 
                                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                                        : 'border-[var(--border-color)]'
                                } flex items-center justify-center`}>
                                    {selectedSupervisors.find(s => s.id === supervisor.id) && (
                                        <Check className="text-white" size={12} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Supervisors */}
            {selectedSupervisors.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--text-color)]">
                        {t("departments.newDepartmentForm.assignSupervisor.supervisor")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSupervisors.map(supervisor => (
                            <div key={supervisor.id} className="flex items-center justify-between p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                                <div className="flex items-center gap-3">
                                    <img src={supervisor.avatar} alt={supervisor.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="text-[var(--text-color)] font-medium">{supervisor.name}</div>
                                        <div className="text-[var(--sub-text-color)] text-sm">{supervisor.role}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-[var(--hover-color)] rounded">
                                        <UserCheck className="text-[var(--sub-text-color)]" size={16} />
                                    </button>
                                    <button 
                                        className="p-1 hover:bg-[var(--hover-color)] rounded"
                                        onClick={() => toggleSupervisor(supervisor)}
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
                <button type="button" className="btn-secondary" onClick={onBack}>{t("departments.newDepartmentForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("departments.newDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 3: Setup Teams
function SetupTeamsStep({ onNext, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [teams, setTeams] = useState([
        { id: 1, name: "UX Team", description: "User Experience", members: 5, teamLeader: { name: "Leslie Alexander", role: "Senior Manager" } },
        { id: 2, name: "UI Team", description: "User Interface", members: 5, teamLeader: { name: "John Doe", role: "Team Lead" } }
    ]);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', selectedEmployees: [], teamLeader: null });
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

    const toggleEmployee = (employee) => {
        setNewTeam(prev => ({
            ...prev,
            selectedEmployees: prev.selectedEmployees.find(e => e.id === employee.id)
                ? prev.selectedEmployees.filter(e => e.id !== employee.id)
                : [...prev.selectedEmployees, employee]
        }));
    };

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
                members: newTeam.selectedEmployees.length,
                teamLeader: newTeam.teamLeader
            }]);
            setNewTeam({ name: '', description: '', selectedEmployees: [], teamLeader: null });
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
                        
                        {/* Team Leader Dropdown */}
                        <div className="relative">
                            <div
                                className="form-input cursor-pointer flex items-center justify-between"
                                onClick={() => setIsLeaderDropdownOpen(!isLeaderDropdownOpen)}
                            >
                                {newTeam.teamLeader ? (
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={newTeam.teamLeader.avatar} 
                                            alt={newTeam.teamLeader.name} 
                                            className="w-6 h-6 rounded-full" 
                                        />
                                        <div>
                                            <div className="text-[var(--text-color)] font-medium text-sm">
                                                {newTeam.teamLeader.name}
                                            </div>
                                            <div className="text-[var(--sub-text-color)] text-xs">
                                                {newTeam.teamLeader.role}
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
                                                newTeam.teamLeader?.id === leader.id 
                                                    ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                                                    : 'border-[var(--border-color)]'
                                            } flex items-center justify-center`}>
                                                {newTeam.teamLeader?.id === leader.id && (
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
                                    {newTeam.selectedEmployees.length > 0 
                                        ? `${newTeam.selectedEmployees.length} selected`
                                        : t("departments.newDepartmentForm.setupTeams.chooseEmployee")
                                    }
                                </span>
                                <div className="flex items-center gap-2">
                                    {newTeam.selectedEmployees.slice(0, 3).map(emp => (
                                        <img key={emp.id} src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full" />
                                    ))}
                                    {newTeam.selectedEmployees.length > 3 && (
                                        <span className="text-xs text-[var(--sub-text-color)]">+{newTeam.selectedEmployees.length - 3}</span>
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
                                                newTeam.selectedEmployees.find(e => e.id === employee.id) 
                                                    ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                                                    : 'border-[var(--border-color)]'
                                            } flex items-center justify-center`}>
                                                {newTeam.selectedEmployees.find(e => e.id === employee.id) && (
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
                                        <span className="text-sm">{team.members} {t("departments.newDepartmentForm.setupTeams.members")}</span>
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
                                            <div className="text-sm font-medium text-[var(--text-color)]">{team.teamLeader.name}</div>
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
function ReviewStep({ onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Mock data for review
    const departmentData = {
        departmentName: "Design Department",
        shortName: "Des",
        description: "Handles all creative design tasks",
        status: "Active"
    };

    const supervisors = [
        { name: "Leslie Alexander", role: "Senior Manager" },
        { name: "John Doe", role: "Team Lead" }
    ];

    const teams = [
        { name: "UX Team", description: "User Experience", members: 5, teamLeader: { name: "Leslie Alexander", role: "Senior Manager" } },
        { name: "UI Team", description: "User Interface", members: 3, teamLeader: { name: "John Doe", role: "Team Lead" } }
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsCompleted(true);
        }, 2000);
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
                            {t("departments.newDepartmentForm.review.shortName")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.shortName}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.newDepartmentForm.review.status")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.status}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.newDepartmentForm.review.description")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.description}</div>
                    </div>
                </div>
            </div>

            {/* Supervisors */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-color)]">
                    {t("departments.newDepartmentForm.review.supervisor")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supervisors.map((supervisor, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                            <img src="/assets/navbar/Avatar.png" alt={supervisor.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="text-[var(--text-color)] font-medium">{supervisor.name}</div>
                                <div className="text-[var(--sub-text-color)] text-sm">{supervisor.role}</div>
                            </div>
                        </div>
                    ))}
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
                                <span className="text-[var(--sub-text-color)] text-sm">
                                    {team.members} {t("departments.newDepartmentForm.setupTeams.members")}
                                </span>
                            </div>
                            
                            {/* Team Leader Info */}
                            {team.teamLeader && (
                                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                                    <img 
                                        src="/assets/navbar/Avatar.png" 
                                        alt={team.teamLeader.name} 
                                        className="w-6 h-6 rounded-full" 
                                    />
                                    <div className="flex-1">
                                        <div className="text-xs text-[var(--sub-text-color)]">Team Leader</div>
                                        <div className="text-sm font-medium text-[var(--text-color)]">{team.teamLeader.name}</div>
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
