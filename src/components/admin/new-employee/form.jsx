import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Eye, ChevronDown, X, Plus, Check, Search, Camera, Sparkles } from "lucide-react";
import { getCompanyId } from "../../../utils/page";
import { useGetAllDepartmentsQuery } from "../../../services/apis/DepartmentApi";
import { useGetAllRolesQuery } from "../../../services/apis/RoleApi";
import { useGetAllShiftsQuery } from "../../../services/apis/ShiftApi";
import { useGetTeamsByDepartmentQuery } from "../../../services/apis/TeamApi";
import { useRegisterMutation } from "../../../services/apis/AuthApi";
import { useLazyCheckUserExistenceByEmailQuery } from "../../../services/apis/UserApi";
import { useAssignUserToCompanyMutation } from "../../../services/apis/CompanyApi";
import toast from "react-hot-toast";

export default function NewEmployeeForm() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [existingUserData, setExistingUserData] = useState(null);

    // Initialize employee data, pre-filling companyId from token/cookie
    const [employeeData, setEmployeeData] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        jobTitle: "",
        hireDate: "",
        companyId: getCompanyId() || "",
        roleId: "",
        departmentId: "",
        teamIds: [],
        shiftIds: [],
    });

    const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
    const [assignUser, { isLoading: isAssigning }] = useAssignUserToCompanyMutation();

    const handleFieldChange = (name, value) => {
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    };

    const steps = [
        { label: t("employees.newEmployeeForm.steps.emailVerification", "Email Verification"), icon: User },
        { label: t("employees.newEmployeeForm.steps.personalInfo"), icon: User },
        { label: t("employees.newEmployeeForm.steps.professionalInfo"), icon: Briefcase },
        { label: "Review & Submit", icon: Eye },
    ];

    // Data for Step 2 selects
    const { data: departmentsRes } = useGetAllDepartmentsQuery({ pageNumber: 1, pageSize: 100 });
    const departments = departmentsRes?.value || departmentsRes?.items || departmentsRes || [];

    const { data: rolesRes } = useGetAllRolesQuery({ pageNumber: 1, pageSize: 100 });
    const roles = rolesRes?.value || rolesRes?.items || rolesRes || [];

    const { data: shiftsRes } = useGetAllShiftsQuery({ pageNumber: 1, pageSize: 100 });
    const shifts = shiftsRes?.value || shiftsRes?.items || shiftsRes || [];

    const { data: teamsRes } = useGetTeamsByDepartmentQuery(employeeData.departmentId, { skip: !employeeData.departmentId });
    const teams = teamsRes?.value || teamsRes?.items || teamsRes || [];

    const handleSubmitAll = async () => {
        try {
            const companyId = getCompanyId();
            if (!companyId) {
                toast.error("Company ID not found. Please login again.");
                return;
            }

            // Check if we're assigning an existing user or registering a new one
            if (existingUserData) {
                // Existing user - use assign endpoint
                const required = {
                    roleId: employeeData.roleId,
                };
                const missing = Object.entries(required)
                    .filter(([, v]) => !v || (typeof v === 'string' && v.trim() === ''))
                    .map(([k]) => k);
                if (missing.length) {
                    toast.error(t("employees.newEmployeeForm.validation.missingFields") || `Missing required fields: ${missing.join(', ')}`);
                    return;
                }

                const assignPayload = {
                    userId: existingUserData.id,
                    roleId: employeeData.roleId,
                    ...(employeeData.jobTitle && employeeData.jobTitle.trim() && { jobTitle: employeeData.jobTitle.trim() }),
                    ...(employeeData.hireDate && { hireDate: new Date(employeeData.hireDate).toISOString() }),
                    ...(employeeData.teamIds && employeeData.teamIds.length > 0 && { teamIds: employeeData.teamIds }),
                    ...(employeeData.shiftIds && employeeData.shiftIds.length > 0 && { shiftIds: employeeData.shiftIds }),
                };

                toast.loading(t("employees.newEmployeeForm.processing.assigning") || "Assigning user to company...");
                await assignUser(assignPayload).unwrap();
                toast.dismiss();
                
                toast.success(t("employees.newEmployeeForm.success.assigned") || "User assigned to company successfully!");
                
                setTimeout(() => {
                    navigate("/pages/admin/all-employees", { replace: true });
                }, 500);
            } else {
                // New user - use register endpoint
                const required = {
                    userName: employeeData.userName,
                    email: employeeData.email,
                    phoneNumber: employeeData.phoneNumber,
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    companyId,
                    roleId: employeeData.roleId,
                };
                const missing = Object.entries(required)
                    .filter(([, v]) => !v || (typeof v === 'string' && v.trim() === ''))
                    .map(([k]) => k);
                if (missing.length) {
                    toast.error(t("employees.newEmployeeForm.validation.missingFields") || `Missing required fields: ${missing.join(', ')}`);
                    return;
                }

                const registerPayload = {
                    userName: employeeData.userName.trim(),
                    email: employeeData.email.trim(),
                    phoneNumber: employeeData.phoneNumber.trim(),
                    firstName: employeeData.firstName.trim(),
                    lastName: employeeData.lastName.trim(),
                    roleId: employeeData.roleId,
                    companyId,
                    ...(employeeData.jobTitle && employeeData.jobTitle.trim() && { jobTitle: employeeData.jobTitle.trim() }),
                    ...(employeeData.hireDate && { hireDate: new Date(employeeData.hireDate).toISOString() }),
                    ...(employeeData.teamIds && employeeData.teamIds.length > 0 && { teamIds: employeeData.teamIds }),
                    ...(employeeData.shiftIds && employeeData.shiftIds.length > 0 && { shiftIds: employeeData.shiftIds }),
                };

                toast.loading(t("employees.newEmployeeForm.processing.register") || "Registering user...");
                await registerUser(registerPayload).unwrap();
                toast.dismiss();
                
                toast.success(t("employees.newEmployeeForm.success.title") || "Employee created successfully!");
                
                setTimeout(() => {
                    navigate("/pages/admin/all-employees", { replace: true });
                }, 500);
            }
        } catch (err) {
            toast.dismiss();
            const apiErrors = err?.data?.errors || err?.data?.Errors;
            const modelState = apiErrors && typeof apiErrors === 'object' ? Object.values(apiErrors).flat().join(' | ') : null;
            const message = modelState || err?.data?.errorMessage || err?.data?.message || err?.message || t("employees.newEmployeeForm.errors.createFailed") || "Failed to create employee";
            toast.error(message);
        }
    };

    return (
        <div className="w-full mx-auto bg-[var(--bg-color)] rounded-2xl border-2 border-[var(--border-color)] shadow-xl overflow-hidden" dir={isArabic ? "rtl" : "ltr"}>
            {/* Enhanced Header with Gradient */}
            <div className="relative bg-gradient-to-r from-[#15919B] via-[#09D1C7] to-[#15919B] p-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className={`absolute ${isArabic ? '-left-10' : '-right-10'} -top-10 w-40 h-40 bg-white rounded-full blur-3xl`}></div>
                    <div className={`absolute ${isArabic ? '-right-10' : '-left-10'} -bottom-10 w-40 h-40 bg-white rounded-full blur-3xl`}></div>
                </div>
                <div className={`relative flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                        <User className="text-white w-6 h-6" />
                    </div>
                    <div className={isArabic ? 'text-right' : 'text-left'}>
                        <div className={`flex items-center gap-2 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <Sparkles className="text-white/80 w-4 h-4" />
                            <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                                {t("employees.newEmployeeForm.subtitle", "Employee Management")}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            {t("employees.newEmployeeForm.title") || "Create New Employee"}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Enhanced Progress Bar */}
                <div className="mb-8">
                    {/* Progress Line */}
                    <div className="relative mb-6">
                        <div className="w-full h-2 bg-[var(--border-color)] rounded-full" />
                        <div
                            className={`absolute top-0 h-2 bg-gradient-to-r from-[#15919B] to-[#09D1C7] rounded-full transition-all duration-500 ${isArabic ? 'right-0' : 'left-0'}`}
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
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
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isArabic ? 'ml-2' : 'mr-2'} ${
                                        isActive || isCompleted 
                                            ? 'bg-gradient-to-r from-[#15919B] to-[#09D1C7] text-white shadow-lg scale-110' 
                                            : 'bg-[var(--container-color)] text-[var(--sub-text-color)]'
                                    }`}>
                                        <IconComponent size={18} />
                                    </div>
                                    <span className={`text-sm font-semibold hidden sm:block transition-colors duration-300 ${
                                        isActive || isCompleted
                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#15919B] to-[#09D1C7]'
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
                        <EmailStep
                            data={employeeData}
                            onChange={handleFieldChange}
                            onNext={(userData) => {
                                setExistingUserData(userData);
                                if (userData) {
                                    // Pre-fill form with existing user data
                                    handleFieldChange('userName', userData.userName || '');
                                    handleFieldChange('phoneNumber', userData.phoneNumber || '');
                                    handleFieldChange('firstName', userData.firstName || '');
                                    handleFieldChange('lastName', userData.lastName || '');
                                }
                                setStep(1);
                            }}
                        />
                    )}
                    {step === 1 && (
                        <PersonalInfoStep
                            data={employeeData}
                            onChange={handleFieldChange}
                            onNext={() => setStep(2)}
                            onBack={() => setStep(0)}
                            existingUserData={existingUserData}
                        />
                    )}
                    {step === 2 && (
                        <ProfessionalInfoStep
                            data={employeeData}
                            onChange={handleFieldChange}
                            departments={departments}
                            roles={roles}
                            shifts={shifts}
                            teams={teams}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <ReviewStep
                            employeeData={employeeData}
                            departments={departments}
                            roles={roles}
                            shifts={shifts}
                            teams={teams}
                            onNext={handleSubmitAll}
                            onBack={() => setStep(2)}
                            loading={isRegistering || isAssigning}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Step 1: Email Verification
function EmailStep({ onNext, onChange, data }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);
    const [checkUserByEmail, { isLoading: isCheckingEmail }] = useLazyCheckUserExistenceByEmailQuery();

    const validateEmail = (email) => {
        if (!email.trim()) {
            return t("employees.newEmployeeForm.validation.emailRequired", "Email is required");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return t("employees.newEmployeeForm.validation.invalidEmail", "Please enter a valid email address");
        }
        return "";
    };

    const handleFieldChange = (value) => {
        onChange('email', value);
        if (touched) {
            const validationError = validateEmail(value);
            setError(validationError);
        }
    };

    const handleBlur = () => {
        setTouched(true);
        const validationError = validateEmail(data.email);
        setError(validationError);
    };

    const handleNext = async () => {
        setTouched(true);
        const validationError = validateEmail(data.email);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            // Check if user exists by email
            const response = await checkUserByEmail(data.email).unwrap();
            
            // If value exists, user is found (pass user data to next step)
            if (response?.value) {
                onNext(response.value);
            } else {
                // User doesn't exist, proceed with empty data
                onNext(null);
            }
        } catch (err) {
            console.error("Error checking email:", err);
            toast.error(t("employees.newEmployeeForm.errors.emailCheckFailed", "Failed to verify email"));
        }
    };

    const isFormValid = !validateEmail(data.email);

    return (
        <div className="space-y-6">
            {/* Email Field */}
            <div className="p-6 bg-gradient-to-br from-[#15919B]/5 to-transparent rounded-xl border-2 border-[var(--border-color)]">
                <div className="space-y-6">
                    <div>
                        <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                            {t("employees.newEmployeeForm.personalInfo.emailAddress") || "Email Address"} <span className="text-[var(--error-color)]">*</span>
                        </label>
                        <input
                            className={`w-full px-4 py-3 border-2 rounded-xl bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                                error 
                                    ? 'border-[var(--error-color)] focus:border-[var(--error-color)] focus:ring-[var(--error-color)]/20' 
                                    : data.email.trim()
                                        ? 'border-[#15919B]/30 focus:border-[#15919B] focus:ring-[#15919B]/20'
                                        : 'border-[var(--border-color)] focus:border-[#15919B] focus:ring-[#15919B]/20'
                            }`}
                            placeholder={t("employees.newEmployeeForm.personalInfo.emailAddress")}
                            type="email"
                            value={data.email}
                            onChange={e => handleFieldChange(e.target.value)}
                            onBlur={handleBlur}
                            dir={isArabic ? 'rtl' : 'ltr'}
                        />
                        {error && (
                            <p className={`mt-2 text-sm text-[var(--error-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6 border-t border-[var(--border-color)]`}>
                <button 
                    type="button" 
                    className="px-6 py-3 rounded-xl border-2 border-[var(--border-color)] text-[var(--text-color)] font-semibold hover:bg-[var(--hover-color)] hover:border-[#15919B]/30 transition-all duration-200" 
                    onClick={() => navigate('/pages/admin/all-employees')}
                >
                    {t("employees.newEmployeeForm.buttons.cancel") || "Cancel"}
                </button>
                <button 
                    type="button" 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isFormValid && !isCheckingEmail
                            ? 'bg-gradient-to-r from-[#15919B] to-[#09D1C7] text-white hover:shadow-lg hover:scale-105'
                            : 'bg-[var(--container-color)] text-[var(--sub-text-color)] border-2 border-[var(--border-color)] cursor-not-allowed opacity-60'
                    }`}
                    onClick={handleNext}
                    disabled={!isFormValid || isCheckingEmail}
                >
                    {isCheckingEmail 
                        ? t("employees.newEmployeeForm.buttons.checking", "Checking...") 
                        : t("employees.newEmployeeForm.buttons.next") || "Next"}
                </button>
            </div>
        </div>
    );
}

// Step 2: Personal Information
function PersonalInfoStep({ onNext, onBack, onChange, data, existingUserData }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    // Check if fields should be read-only (when user already exists)
    const isReadOnly = !!existingUserData;

    const getLabel = (key) => {
        const map = {
            userName: t("employees.newEmployeeForm.professionalInfo.userName") || "Username",
            email: t("employees.newEmployeeForm.personalInfo.emailAddress") || "Email",
            phoneNumber: t("employees.newEmployeeForm.personalInfo.mobileNumber") || "Mobile number",
            firstName: t("employees.newEmployeeForm.personalInfo.firstName") || "First name",
            lastName: t("employees.newEmployeeForm.personalInfo.lastName") || "Last name",
            jobTitle: "Job Title",
        };
        return map[key] || key;
    };

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'userName':
                if (!value?.trim()) {
                    error = `${getLabel('userName')} ${t('employees.newEmployeeForm.validation.isRequired') || 'is required'}`;
                } else if (!/^[A-Za-z]+$/.test(value)) {
                    error = t('employees.newEmployeeForm.validation.usernameLettersOnly') || 'Username must contain only letters (A-Z)';
                }
                break;
                
            case 'email':
                if (!value?.trim()) {
                    error = `${getLabel('email')} ${t('employees.newEmployeeForm.validation.isRequired') || 'is required'}`;
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        error = t('employees.newEmployeeForm.validation.invalidEmail') || 'Please enter a valid email address';
                    }
                }
                break;
                
            case 'phoneNumber':
                if (!value?.trim()) {
                    error = `${getLabel('phoneNumber')} ${t('employees.newEmployeeForm.validation.isRequired') || 'is required'}`;
                }
                break;
                
            case 'firstName':
                if (!value?.trim()) {
                    error = `${getLabel('firstName')} ${t('employees.newEmployeeForm.validation.isRequired') || 'is required'}`;
                }
                break;
                
            case 'lastName':
                if (!value?.trim()) {
                    error = `${getLabel('lastName')} ${t('employees.newEmployeeForm.validation.isRequired') || 'is required'}`;
                }
                break;
                
            default:
                break;
        }
        
        return error;
    };

    const validate = () => {
        const newErrors = {};
        Object.keys(data).forEach(key => {
            if (['userName', 'phoneNumber', 'firstName', 'lastName'].includes(key)) {
                const error = validateField(key, data[key]);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check form validity without setting state (for use during render)
    const checkFormValid = useMemo(() => {
        const requiredFields = ['userName', 'phoneNumber', 'firstName', 'lastName'];
        return requiredFields.every(field => {
            const value = data[field];
            if (!value || (typeof value === 'string' && !value.trim())) {
                return false;
            }
            // Additional validation for specific fields
            if (field === 'userName') {
                return /^[A-Za-z]+$/.test(value);
            }
            return true;
        });
    }, [data.userName, data.phoneNumber, data.firstName, data.lastName]);

    const handleFieldChange = (name, value) => {
        onChange(name, value);
        
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, data[name]);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleNext = () => {
        const allFields = ['userName', 'email', 'phoneNumber', 'firstName', 'lastName'];
        const newTouched = {};
        allFields.forEach(field => { newTouched[field] = true; });
        setTouched(newTouched);
        
        if (validate()) {
            onNext();
        }
    };

    const isFormValid = checkFormValid;

    return (
        <div className="space-y-6">
            {/* Enhanced Form Section */}
            <div className="p-6 bg-gradient-to-br from-[#15919B]/5 to-transparent rounded-xl border-2 border-[var(--border-color)]">
                {/* Avatar Upload */}
                <div className={`flex ${isArabic ? 'justify-end' : 'justify-start'} mb-6`}>
                    <div className="w-20 h-20 rounded-xl bg-[var(--container-color)] border-2 border-dashed border-[var(--border-color)] flex items-center justify-center cursor-pointer hover:bg-[var(--hover-color)] transition-colors">
                        <Camera className="text-[var(--sub-text-color)]" size={24} />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div>
                            <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                                {t("employees.newEmployeeForm.professionalInfo.userName") || "Username"} <span className="text-[var(--error-color)]">*</span>
                            </label>
                            <input
                                className={`w-full px-4 py-3 border-2 rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                                    isReadOnly 
                                        ? 'bg-[var(--container-color)] border-[var(--border-color)] cursor-not-allowed'
                                        : errors.userName 
                                            ? 'border-[var(--error-color)] focus:border-[var(--error-color)] focus:ring-[var(--error-color)]/20 bg-[var(--bg-color)]' 
                                            : data.userName.trim()
                                                ? 'border-[#15919B]/30 focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                                : 'border-[var(--border-color)] focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                }`}
                                placeholder={t("employees.newEmployeeForm.professionalInfo.userName")}
                                type="text"
                                value={data.userName}
                                onChange={e => !isReadOnly && handleFieldChange('userName', e.target.value.replace(/[^A-Za-z]/g, ''))}
                                onBlur={() => !isReadOnly && handleBlur('userName')}
                                dir={isArabic ? 'rtl' : 'ltr'}
                                readOnly={isReadOnly}
                            />
                            {errors.userName && (
                                <p className={`mt-2 text-sm text-[var(--error-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                                    {errors.userName}
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                                {t("employees.newEmployeeForm.personalInfo.mobileNumber") || "Mobile Number"} <span className="text-[var(--error-color)]">*</span>
                            </label>
                            <input
                                className={`w-full px-4 py-3 border-2 rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                                    isReadOnly 
                                        ? 'bg-[var(--container-color)] border-[var(--border-color)] cursor-not-allowed'
                                        : errors.phoneNumber 
                                            ? 'border-[var(--error-color)] focus:border-[var(--error-color)] focus:ring-[var(--error-color)]/20 bg-[var(--bg-color)]' 
                                            : data.phoneNumber.trim()
                                                ? 'border-[#15919B]/30 focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                                : 'border-[var(--border-color)] focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                }`}
                                placeholder={t("employees.newEmployeeForm.personalInfo.mobileNumber")}
                                type="tel"
                                value={data.phoneNumber}
                                onChange={e => !isReadOnly && handleFieldChange('phoneNumber', e.target.value)}
                                onBlur={() => !isReadOnly && handleBlur('phoneNumber')}
                                dir={isArabic ? 'rtl' : 'ltr'}
                                readOnly={isReadOnly}
                            />
                            {errors.phoneNumber && (
                                <p className={`mt-2 text-sm text-[var(--error-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>

                        {/* First Name */}
                        <div>
                            <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                                {t("employees.newEmployeeForm.personalInfo.firstName") || "First Name"} <span className="text-[var(--error-color)]">*</span>
                            </label>
                            <input
                                className={`w-full px-4 py-3 border-2 rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                                    isReadOnly 
                                        ? 'bg-[var(--container-color)] border-[var(--border-color)] cursor-not-allowed'
                                        : errors.firstName 
                                            ? 'border-[var(--error-color)] focus:border-[var(--error-color)] focus:ring-[var(--error-color)]/20 bg-[var(--bg-color)]' 
                                            : data.firstName.trim()
                                                ? 'border-[#15919B]/30 focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                                : 'border-[var(--border-color)] focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                }`}
                                placeholder={t("employees.newEmployeeForm.personalInfo.firstName")}
                                type="text"
                                value={data.firstName}
                                onChange={e => !isReadOnly && handleFieldChange('firstName', e.target.value)}
                                onBlur={() => !isReadOnly && handleBlur('firstName')}
                                dir={isArabic ? 'rtl' : 'ltr'}
                                readOnly={isReadOnly}
                            />
                            {errors.firstName && (
                                <p className={`mt-2 text-sm text-[var(--error-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                                {t("employees.newEmployeeForm.personalInfo.lastName") || "Last Name"} <span className="text-[var(--error-color)]">*</span>
                            </label>
                            <input
                                className={`w-full px-4 py-3 border-2 rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                                    isReadOnly 
                                        ? 'bg-[var(--container-color)] border-[var(--border-color)] cursor-not-allowed'
                                        : errors.lastName 
                                            ? 'border-[var(--error-color)] focus:border-[var(--error-color)] focus:ring-[var(--error-color)]/20 bg-[var(--bg-color)]' 
                                            : data.lastName.trim()
                                                ? 'border-[#15919B]/30 focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                                : 'border-[var(--border-color)] focus:border-[#15919B] focus:ring-[#15919B]/20 bg-[var(--bg-color)]'
                                }`}
                                placeholder={t("employees.newEmployeeForm.personalInfo.lastName")}
                                type="text"
                                value={data.lastName}
                                onChange={e => !isReadOnly && handleFieldChange('lastName', e.target.value)}
                                onBlur={() => !isReadOnly && handleBlur('lastName')}
                                dir={isArabic ? 'rtl' : 'ltr'}
                                readOnly={isReadOnly}
                            />
                            {errors.lastName && (
                                <p className={`mt-2 text-sm text-[var(--error-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                                    {errors.lastName}
                                </p>
                            )}
                        </div>

                        {/* Job Title */}
                        <div>
                            <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                                Job Title <span className="text-xs text-[var(--sub-text-color)]">({t("common.optional", "Optional")})</span>
                            </label>
                            <input
                                className={`w-full px-4 py-3 border-2 rounded-xl bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                                    data.jobTitle.trim()
                                        ? 'border-[#15919B]/30 focus:border-[#15919B] focus:ring-[#15919B]/20'
                                        : 'border-[var(--border-color)] focus:border-[#15919B] focus:ring-[#15919B]/20'
                                }`}
                                placeholder="Job Title"
                                type="text"
                                value={data.jobTitle}
                                onChange={e => handleFieldChange('jobTitle', e.target.value)}
                                dir={isArabic ? 'rtl' : 'ltr'}
                            />
                        </div>

                        {/* Hire Date */}
                        <div>
                            <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                                {t("employees.newEmployeeForm.personalInfo.hireDate") || "Hire Date"} <span className="text-xs text-[var(--sub-text-color)]">({t("common.optional", "Optional")})</span>
                            </label>
                            <input
                                className="w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-xl bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[#15919B]/20 focus:border-[#15919B] transition-all"
                                placeholder={t("employees.newEmployeeForm.personalInfo.hireDate") || "Hire Date"}
                                type="date"
                                value={data.hireDate || ""}
                                onChange={e => onChange('hireDate', e.target.value)}
                                dir={isArabic ? 'rtl' : 'ltr'}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6 border-t border-[var(--border-color)]`}>
                <button 
                    type="button" 
                    className="px-6 py-3 rounded-xl border-2 border-[var(--border-color)] text-[var(--text-color)] font-semibold hover:bg-[var(--hover-color)] hover:border-[#15919B]/30 transition-all duration-200" 
                    onClick={onBack}
                >
                    {t("employees.newEmployeeForm.buttons.back") || "Back"}
                </button>
                <button 
                    type="button" 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isFormValid
                            ? 'bg-gradient-to-r from-[#15919B] to-[#09D1C7] text-white hover:shadow-lg hover:scale-105'
                            : 'bg-[var(--container-color)] text-[var(--sub-text-color)] border-2 border-[var(--border-color)] cursor-not-allowed opacity-60'
                    }`}
                    onClick={handleNext}
                    disabled={!isFormValid}
                >
                    {t("employees.newEmployeeForm.buttons.next") || "Next"}
                </button>
            </div>
        </div>
    );
}

// Step 2: Professional Information
function ProfessionalInfoStep({ onNext, onBack, onChange, data, departments, roles, shifts, teams }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [error, setError] = useState("");
    
    // Dropdown states
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isShiftOpen, setIsShiftOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    
    // Search terms
    const [deptSearch, setDeptSearch] = useState("");
    const [roleSearch, setRoleSearch] = useState("");
    const [shiftSearch, setShiftSearch] = useState("");
    const [teamSearch, setTeamSearch] = useState("");

    const deptOptions = Array.isArray(departments) ? departments : [];
    const roleOptions = Array.isArray(roles) ? roles : [];
    const shiftOptions = Array.isArray(shifts) ? shifts : [];
    const teamOptions = Array.isArray(teams) ? teams : [];

    // Filtered options
    const filteredDepts = useMemo(() => {
        if (!deptSearch.trim()) return deptOptions;
        const search = deptSearch.toLowerCase();
        return deptOptions.filter(d => 
            (d.name || d.departmentName || '').toLowerCase().includes(search)
        );
    }, [deptOptions, deptSearch]);

    const filteredRoles = useMemo(() => {
        if (!roleSearch.trim()) return roleOptions;
        const search = roleSearch.toLowerCase();
        return roleOptions.filter(r => 
            (r.name || r.roleName || r.code || '').toLowerCase().includes(search)
        );
    }, [roleOptions, roleSearch]);

    const filteredShifts = useMemo(() => {
        if (!shiftSearch.trim()) return shiftOptions;
        const search = shiftSearch.toLowerCase();
        return shiftOptions.filter(s => 
            (s.name || s.shiftName || '').toLowerCase().includes(search)
        );
    }, [shiftOptions, shiftSearch]);

    const filteredTeams = useMemo(() => {
        if (!teamSearch.trim()) return teamOptions;
        const search = teamSearch.toLowerCase();
        return teamOptions.filter(t => 
            (t.name || t.teamName || '').toLowerCase().includes(search)
        );
    }, [teamOptions, teamSearch]);

    const selectedDept = deptOptions.find(d => (d.id || d.departmentId) === data.departmentId);
    const selectedRole = roleOptions.find(r => (r.id || r.roleId) === data.roleId);
    const selectedShifts = shiftOptions.filter(s => (data.shiftIds || []).includes(s.id || s.shiftId));
    const selectedTeams = teamOptions.filter(t => (data.teamIds || []).includes(t.id || t.teamId));

    const toggleShift = (shiftId) => {
        const currentIds = data.shiftIds || [];
        if (currentIds.includes(shiftId)) {
            onChange('shiftIds', currentIds.filter(id => id !== shiftId));
        } else {
            onChange('shiftIds', [...currentIds, shiftId]);
        }
    };

    const toggleTeam = (teamId) => {
        const currentIds = data.teamIds || [];
        if (currentIds.includes(teamId)) {
            onChange('teamIds', currentIds.filter(id => id !== teamId));
        } else {
            onChange('teamIds', [...currentIds, teamId]);
        }
    };

    const handleNext = () => {
        if (!data.roleId) {
            setError(t("employees.newEmployeeForm.validation.roleRequired") || "Role is required");
            return;
        }
        
        setError("");
        onNext();
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}
            
            {/* Enhanced Form Section */}
            <div className="p-6 bg-gradient-to-br from-[#09D1C7]/5 to-transparent rounded-xl border-2 border-[var(--border-color)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department Dropdown */}
                <div className="relative">
                    <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t("employees.newEmployeeForm.professionalInfo.selectDepartment") || "Department"} <span className="text-xs text-[var(--sub-text-color)]">({t("common.optional", "Optional")})</span>
                    </label>
                    <div className="w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-xl bg-[var(--bg-color)] cursor-pointer flex items-center justify-between hover:border-[#09D1C7]/50 transition-all" onClick={() => setIsDeptOpen(!isDeptOpen)}>
                        <span className={selectedDept ? "text-[var(--text-color)] font-medium" : "text-[var(--sub-text-color)]"}>
                            {selectedDept ? (selectedDept.name || selectedDept.departmentName) : t("employees.newEmployeeForm.professionalInfo.selectDepartment")}
                        </span>
                        <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isDeptOpen ? 'rotate-180' : ''}`} size={18} />
                    </div>
                    {isDeptOpen && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                            <div className="p-2 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-color)]">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sub-text-color)]" />
                                    <input
                                        type="text"
                                        value={deptSearch}
                                        onChange={(e) => setDeptSearch(e.target.value)}
                                        placeholder="Search departments..."
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        onClick={(e) => e.stopPropagation()}
                                        dir={isArabic ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[240px]">
                                {filteredDepts.map((d) => (
                                    <div 
                                        key={d.id || d.departmentId} 
                                        className="p-3 hover:bg-[var(--hover-color)] cursor-pointer"
                                        onClick={() => {
                                            onChange('departmentId', d.id || d.departmentId);
                                            onChange('teamIds', []);
                                            setIsDeptOpen(false);
                                            setDeptSearch("");
                                        }}
                                    >
                                        <div className="text-sm text-[var(--text-color)]">{d.name || d.departmentName}</div>
                                    </div>
                                ))}
                                {filteredDepts.length === 0 && (
                                    <div className="p-3 text-[var(--sub-text-color)]">No departments found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Role Dropdown */}
                <div className="relative">
                    <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t("employees.newEmployeeForm.professionalInfo.selectEmployeeRole") || "Role"} <span className="text-[var(--error-color)]">*</span>
                    </label>
                    <div className={`w-full px-4 py-3 border-2 rounded-xl bg-[var(--bg-color)] cursor-pointer flex items-center justify-between transition-all ${
                        !data.roleId && error 
                            ? 'border-[var(--error-color)]' 
                            : selectedRole
                                ? 'border-[#09D1C7]/30 hover:border-[#09D1C7]/50'
                                : 'border-[var(--border-color)] hover:border-[#09D1C7]/50'
                    }`} onClick={() => setIsRoleOpen(!isRoleOpen)}>
                        <span className={selectedRole ? "text-[var(--text-color)] font-medium" : "text-[var(--sub-text-color)]"}>
                            {selectedRole ? (selectedRole.name || selectedRole.roleName || selectedRole.code) : t("employees.newEmployeeForm.professionalInfo.selectEmployeeRole")}
                        </span>
                        <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} size={18} />
                    </div>
                    {isRoleOpen && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                            <div className="p-2 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-color)]">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sub-text-color)]" />
                                    <input
                                        type="text"
                                        value={roleSearch}
                                        onChange={(e) => setRoleSearch(e.target.value)}
                                        placeholder="Search roles..."
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        onClick={(e) => e.stopPropagation()}
                                        dir={isArabic ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[240px]">
                                {filteredRoles.map((r) => (
                                    <div 
                                        key={r.id || r.roleId} 
                                        className="p-3 hover:bg-[var(--hover-color)] cursor-pointer"
                                        onClick={() => {
                                            onChange('roleId', r.id || r.roleId);
                                            setIsRoleOpen(false);
                                            setRoleSearch("");
                                            setError("");
                                        }}
                                    >
                                        <div className="text-sm text-[var(--text-color)]">{r.name || r.roleName || r.code}</div>
                                    </div>
                                ))}
                                {filteredRoles.length === 0 && (
                                    <div className="p-3 text-[var(--sub-text-color)]">No roles found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Shifts Multi-Select */}
                <div className="md:col-span-2 relative">
                    <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                        Select Shift <span className="text-xs text-[var(--sub-text-color)]">({t("common.optional", "Optional")})</span>
                    </label>
                    <div className="w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-xl bg-[var(--bg-color)] cursor-pointer flex items-center justify-between hover:border-[#09D1C7]/50 transition-all" onClick={() => setIsShiftOpen(!isShiftOpen)}>
                        <span className={selectedShifts.length > 0 ? "text-[var(--text-color)] font-medium" : "text-[var(--sub-text-color)]"}>
                            {selectedShifts.length > 0 
                                ? `${selectedShifts.length} shift(s) selected` 
                                : "Select shifts (optional)"}
                        </span>
                        <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isShiftOpen ? 'rotate-180' : ''}`} size={18} />
                    </div>
                    {isShiftOpen && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                            <div className="p-2 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-color)]">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sub-text-color)]" />
                                    <input
                                        type="text"
                                        value={shiftSearch}
                                        onChange={(e) => setShiftSearch(e.target.value)}
                                        placeholder="Search shifts..."
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        onClick={(e) => e.stopPropagation()}
                                        dir={isArabic ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[240px]">
                                {filteredShifts.map((s) => {
                                    const shiftId = s.id || s.shiftId;
                                    const isSelected = (data.shiftIds || []).includes(shiftId);
                                    return (
                                        <div 
                                            key={shiftId} 
                                            className={`p-3 cursor-pointer flex items-center justify-between ${isSelected ? 'bg-[var(--accent-color)] bg-opacity-10' : 'hover:bg-[var(--hover-color)]'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleShift(shiftId);
                                            }}
                                        >
                                            <div className="text-sm text-[var(--text-color)]">{s.name || s.shiftName}</div>
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                                isSelected 
                                                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]' 
                                                    : 'border-[var(--border-color)]'
                                            }`}>
                                                {isSelected && <Check className="text-white" size={12} />}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredShifts.length === 0 && (
                                    <div className="p-3 text-[var(--sub-text-color)]">No shifts found</div>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedShifts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedShifts.map((s) => (
                                <div key={s.id || s.shiftId} className="flex items-center gap-1 px-2 py-1 bg-[var(--container-color)] rounded-lg text-xs border border-[var(--border-color)]">
                                    <span className="text-[var(--text-color)]">{s.name || s.shiftName}</span>
                                    <X 
                                        size={12} 
                                        className="text-[var(--sub-text-color)] cursor-pointer hover:text-red-500" 
                                        onClick={() => toggleShift(s.id || s.shiftId)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Teams Multi-Select */}
                <div className="md:col-span-2 relative">
                    <label className={`block text-sm font-semibold text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                        Select Team <span className="text-xs text-[var(--sub-text-color)]">({t("common.optional", "Optional")})</span>
                    </label>
                    <div 
                        className={`w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-xl bg-[var(--bg-color)] cursor-pointer flex items-center justify-between transition-all ${
                            !data.departmentId 
                                ? 'opacity-50 cursor-not-allowed' 
                                : selectedTeams.length > 0
                                    ? 'border-[#09D1C7]/30 hover:border-[#09D1C7]/50'
                                    : 'hover:border-[#09D1C7]/50'
                        }`} 
                        onClick={() => data.departmentId && setIsTeamOpen(!isTeamOpen)}
                    >
                        <span className={selectedTeams.length > 0 ? "text-[var(--text-color)] font-medium" : "text-[var(--sub-text-color)]"}>
                            {!data.departmentId 
                                ? "Select department first"
                                : selectedTeams.length > 0 
                                    ? `${selectedTeams.length} team(s) selected` 
                                    : "Select teams (optional)"}
                        </span>
                        <ChevronDown className={`text-[var(--sub-text-color)] transition-transform ${isTeamOpen ? 'rotate-180' : ''}`} size={18} />
                    </div>
                    {isTeamOpen && data.departmentId && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                            <div className="p-2 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-color)]">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sub-text-color)]" />
                                    <input
                                        type="text"
                                        value={teamSearch}
                                        onChange={(e) => setTeamSearch(e.target.value)}
                                        placeholder="Search teams..."
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        onClick={(e) => e.stopPropagation()}
                                        dir={isArabic ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[240px]">
                                {filteredTeams.map((t) => {
                                    const teamId = t.id || t.teamId;
                                    const isSelected = (data.teamIds || []).includes(teamId);
                                    return (
                                        <div 
                                            key={teamId} 
                                            className={`p-3 cursor-pointer flex items-center justify-between ${isSelected ? 'bg-[var(--accent-color)] bg-opacity-10' : 'hover:bg-[var(--hover-color)]'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleTeam(teamId);
                                            }}
                                        >
                                            <div className="text-sm text-[var(--text-color)]">{t.name || t.teamName}</div>
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                                isSelected 
                                                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]' 
                                                    : 'border-[var(--border-color)]'
                                            }`}>
                                                {isSelected && <Check className="text-white" size={12} />}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredTeams.length === 0 && (
                                    <div className="p-3 text-[var(--sub-text-color)]">No teams found</div>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedTeams.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTeams.map((t) => (
                                <div key={t.id || t.teamId} className="flex items-center gap-1 px-2 py-1 bg-[var(--container-color)] rounded-lg text-xs border border-[var(--border-color)]">
                                    <span className="text-[var(--text-color)]">{t.name || t.teamName}</span>
                                    <X 
                                        size={12} 
                                        className="text-[var(--sub-text-color)] cursor-pointer hover:text-red-500" 
                                        onClick={() => toggleTeam(t.id || t.teamId)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6 border-t border-[var(--border-color)]`}>
                <button 
                    type="button" 
                    className="px-6 py-3 rounded-xl border-2 border-[var(--border-color)] text-[var(--text-color)] font-semibold hover:bg-[var(--hover-color)] hover:border-[#15919B]/30 transition-all duration-200" 
                    onClick={onBack}
                >
                    {t("employees.newEmployeeForm.buttons.back") || "Back"}
                </button>
                <button 
                    type="button" 
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#15919B] to-[#09D1C7] text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200" 
                    onClick={handleNext}
                >
                    {t("employees.newEmployeeForm.buttons.next") || "Next"}
                </button>
            </div>
        </div>
    );
}

// Step 3: Review & Submit
function ReviewStep({ onNext, onBack, employeeData, departments, roles, shifts, teams, loading }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const selectedDept = departments.find(d => (d.id || d.departmentId) === employeeData.departmentId);
    const selectedRole = roles.find(r => (r.id || r.roleId) === employeeData.roleId);
    const selectedShifts = shifts.filter(s => (employeeData.shiftIds || []).includes(s.id || s.shiftId));
    const selectedTeams = teams.filter(t => (employeeData.teamIds || []).includes(t.id || t.teamId));

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-[var(--text-color)]">
                {t("employees.newEmployeeForm.review.title") || "Review Employee Details"}
            </h2>

            {/* Personal Information */}
            <div className="p-6 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                    {t("employees.newEmployeeForm.steps.personalInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">Username:</span>
                        <div className="text-[var(--text-color)] font-medium">{employeeData.userName}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">Email:</span>
                        <div className="text-[var(--text-color)] font-medium">{employeeData.email}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">First Name:</span>
                        <div className="text-[var(--text-color)] font-medium">{employeeData.firstName}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">Last Name:</span>
                        <div className="text-[var(--text-color)] font-medium">{employeeData.lastName}</div>
                    </div>
                    <div>
                        <span className="text-[var(--sub-text-color)] text-sm">Phone Number:</span>
                        <div className="text-[var(--text-color)] font-medium">{employeeData.phoneNumber}</div>
                    </div>
                    {employeeData.jobTitle && employeeData.jobTitle.trim() && (
                        <div>
                            <span className="text-[var(--sub-text-color)] text-sm">Job Title:</span>
                            <div className="text-[var(--text-color)] font-medium">{employeeData.jobTitle}</div>
                        </div>
                    )}
                    {employeeData.hireDate && (
                        <div>
                            <span className="text-[var(--sub-text-color)] text-sm">Hire Date:</span>
                            <div className="text-[var(--text-color)] font-medium">{new Date(employeeData.hireDate).toLocaleDateString()}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Information */}
            <div className="p-6 bg-[var(--container-color)] rounded-lg border border-[var(--border-color)]">
                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                    {t("employees.newEmployeeForm.steps.professionalInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDept && (
                        <div>
                            <span className="text-[var(--sub-text-color)] text-sm">Department:</span>
                            <div className="text-[var(--text-color)] font-medium">{selectedDept.name || selectedDept.departmentName}</div>
                        </div>
                    )}
                    {selectedRole && (
                        <div>
                            <span className="text-[var(--sub-text-color)] text-sm">Role:</span>
                            <div className="text-[var(--text-color)] font-medium">{selectedRole.name || selectedRole.roleName || selectedRole.code}</div>
                        </div>
                    )}
                    {selectedShifts.length > 0 && (
                        <div className="md:col-span-2">
                            <span className="text-[var(--sub-text-color)] text-sm">Shifts:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedShifts.map((s) => (
                                    <span key={s.id || s.shiftId} className="px-2 py-1 bg-[var(--bg-color)] rounded text-sm text-[var(--text-color)] border border-[var(--border-color)]">
                                        {s.name || s.shiftName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTeams.length > 0 && (
                        <div className="md:col-span-2">
                            <span className="text-[var(--sub-text-color)] text-sm">Teams:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedTeams.map((t) => (
                                    <span key={t.id || t.teamId} className="px-2 py-1 bg-[var(--bg-color)] rounded text-sm text-[var(--text-color)] border border-[var(--border-color)]">
                                        {t.name || t.teamName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6 border-t border-[var(--border-color)]`}>
                <button 
                    type="button" 
                    className="px-6 py-3 rounded-xl border-2 border-[var(--border-color)] text-[var(--text-color)] font-semibold hover:bg-[var(--hover-color)] hover:border-[#15919B]/30 transition-all duration-200" 
                    onClick={onBack} 
                    disabled={loading}
                >
                    {t("employees.newEmployeeForm.buttons.back") || "Back"}
                </button>
                <button 
                    type="button" 
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#15919B] to-[#09D1C7] text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={onNext}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t("employees.newEmployeeForm.buttons.submitting") || t("common.loading") || "Processing..."}</span>
                        </>
                    ) : (
                        <>
                            <Plus size={16} />
                            {t("employees.newEmployeeForm.buttons.submit") || t("common.submit") || "Create Employee"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

