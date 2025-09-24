import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, Users, UserCheck, Eye, ChevronDown, X, Plus, Check, Save } from "lucide-react";

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

    // Mock data - in real app, this would be fetched based on ID
    const [departmentData, setDepartmentData] = useState({
        id: id,
        name: "Marketing Department",
        shortName: "MKT",
        description: "Handles all marketing and promotional activities",
        status: "active",
        supervisors: [
            { id: 1, name: "Leslie Alexander", role: "Senior Manager", avatar: "/assets/navbar/Avatar.png" },
            { id: 2, name: "John Doe", role: "Team Lead", avatar: "/assets/navbar/Avatar.png" }
        ],
        teams: [
            { id: 1, name: "Digital Marketing", description: "Online Marketing & SEO", members: 6 },
            { id: 2, name: "Content Marketing", description: "Content Creation & Strategy", members: 4 },
            { id: 3, name: "Brand Marketing", description: "Brand Management & PR", members: 4 }
        ]
    });

    return (
        <div className="w-full mx-auto bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]" dir={isArabic ? "rtl" : "ltr"}>
            {/* Header with Breadcrumb */}
            <div className="p-6 border-b border-[var(--border-color)]">
                <h1 className="text-2xl font-bold text-[var(--text-color)] mb-2">
                    {t("departments.editDepartmentForm.title")} - {departmentData.name}
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
                    {step === 1 && <EditAssignSupervisorStep departmentData={departmentData} setDepartmentData={setDepartmentData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                    {step === 2 && <EditSetupTeamsStep departmentData={departmentData} setDepartmentData={setDepartmentData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                    {step === 3 && <EditReviewStep departmentData={departmentData} onBack={() => setStep(2)} />}
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
                <input
                    className="form-input"
                    placeholder={t("departments.editDepartmentForm.departmentInfo.shortName")}
                    type="text"
                    value={departmentData.shortName}
                    onChange={(e) => handleInputChange('shortName', e.target.value)}
                />
                <textarea
                    className="form-input md:col-span-1"
                    placeholder={t("departments.editDepartmentForm.departmentInfo.description")}
                    rows="4"
                    value={departmentData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <div className="relative">
                    <select 
                        className="form-input appearance-none cursor-pointer pr-10"
                        value={departmentData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                        <option value="">{t("departments.editDepartmentForm.departmentInfo.status")}</option>
                        <option value="active">{t("departments.editDepartmentForm.departmentInfo.active")}</option>
                        <option value="inactive">{t("departments.editDepartmentForm.departmentInfo.inactive")}</option>
                    </select>
                </div>
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
function EditAssignSupervisorStep({ departmentData, setDepartmentData, onNext, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Mock supervisor data
    const availableSupervisors = [
        { id: 1, name: "Leslie Alexander", role: "Senior Manager", avatar: "/assets/navbar/Avatar.png" },
        { id: 2, name: "John Doe", role: "Team Lead", avatar: "/assets/navbar/Avatar.png" },
        { id: 3, name: "Jane Smith", role: "Department Head", avatar: "/assets/navbar/Avatar.png" },
        { id: 4, name: "Mike Johnson", role: "Senior Manager", avatar: "/assets/navbar/Avatar.png" }
    ];

    const toggleSupervisor = (supervisor) => {
        setDepartmentData(prev => {
            const isSelected = prev.supervisors.find(s => s.id === supervisor.id);
            if (isSelected) {
                return {
                    ...prev,
                    supervisors: prev.supervisors.filter(s => s.id !== supervisor.id)
                };
            } else {
                return {
                    ...prev,
                    supervisors: [...prev.supervisors, supervisor]
                };
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
                        {t("departments.editDepartmentForm.assignSupervisor.chooseSupervisor")}
                    </span>
                    <ChevronDown 
                        className={`text-[var(--sub-text-color)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        size={16} 
                    />
                </div>
                
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {availableSupervisors.map(supervisor => (
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
                                    departmentData.supervisors.find(s => s.id === supervisor.id) 
                                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                                        : 'border-[var(--border-color)]'
                                } flex items-center justify-center`}>
                                    {departmentData.supervisors.find(s => s.id === supervisor.id) && (
                                        <Check className="text-white" size={12} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Supervisors */}
            {departmentData.supervisors.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--text-color)]">
                        {t("departments.editDepartmentForm.assignSupervisor.supervisor")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {departmentData.supervisors.map(supervisor => (
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
                <button type="button" className="btn-secondary" onClick={onBack}>{t("departments.editDepartmentForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("departments.editDepartmentForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 3: Edit Setup Teams
function EditSetupTeamsStep({ departmentData, setDepartmentData, onNext, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', selectedEmployees: [] });
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

    // Mock employee data
    const employees = [
        { id: 1, name: "Alice Johnson", role: "Marketing Specialist", avatar: "/assets/navbar/Avatar.png" },
        { id: 2, name: "Bob Smith", role: "Content Creator", avatar: "/assets/navbar/Avatar.png" },
        { id: 3, name: "Carol Davis", role: "SEO Specialist", avatar: "/assets/navbar/Avatar.png" },
        { id: 4, name: "David Wilson", role: "Brand Manager", avatar: "/assets/navbar/Avatar.png" }
    ];

    const toggleEmployee = (employee) => {
        setNewTeam(prev => ({
            ...prev,
            selectedEmployees: prev.selectedEmployees.find(e => e.id === employee.id)
                ? prev.selectedEmployees.filter(e => e.id !== employee.id)
                : [...prev.selectedEmployees, employee]
        }));
    };

    const addTeam = () => {
        if (newTeam.name.trim()) {
            setDepartmentData(prev => ({
                ...prev,
                teams: [...prev.teams, {
                    id: Date.now(),
                    name: newTeam.name,
                    description: newTeam.description,
                    members: newTeam.selectedEmployees.length
                }]
            }));
            setNewTeam({ name: '', description: '', selectedEmployees: [] });
            setShowAddTeam(false);
        }
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
                        <div className="relative">
                            <div
                                className="form-input cursor-pointer flex items-center justify-between"
                                onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                            >
                                <span className="text-[var(--sub-text-color)]">
                                    {newTeam.selectedEmployees.length > 0 
                                        ? `${newTeam.selectedEmployees.length} selected`
                                        : t("departments.editDepartmentForm.setupTeams.chooseEmployee")
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
function EditReviewStep({ departmentData, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

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
                            {t("departments.editDepartmentForm.review.shortName")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.shortName}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.editDepartmentForm.review.status")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.status}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">
                            {t("departments.editDepartmentForm.review.description")}:
                        </span>
                        <div className="text-[var(--text-color)] font-medium">{departmentData.description}</div>
                    </div>
                </div>
            </div>

            {/* Supervisors */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-color)]">
                    {t("departments.editDepartmentForm.review.supervisor")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departmentData.supervisors.map((supervisor, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                            <img src={supervisor.avatar} alt={supervisor.name} className="w-10 h-10 rounded-full" />
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
