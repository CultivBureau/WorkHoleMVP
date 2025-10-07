import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Briefcase, FileText, Shield, Camera, Upload, Check } from "lucide-react";

export default function NewEmployeeForm() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [step, setStep] = useState(0);

    const steps = [
        { label: t("employees.newEmployeeForm.steps.personalInfo"), icon: User },
        { label: t("employees.newEmployeeForm.steps.professionalInfo"), icon: Briefcase },
        { label: t("employees.newEmployeeForm.steps.documents"), icon: FileText },
        { label: t("employees.newEmployeeForm.steps.accountAccess"), icon: Shield },
    ];

    return (
        <div className="w-full  mx-auto bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)] p-8" dir={isArabic ? "rtl" : "ltr"}>
            {/* Progress Bar */}
            <div className="mb-8">
                {/* Progress Line */}
                <div className="relative mb-4">
                    <div className="w-full h-1 bg-[var(--border-color)] rounded" />
                    <div
                        className={`absolute top-0 h-1 gradient-bg rounded transition-all duration-300 ${isArabic ? 'right-0' : 'left-0'}`}
                        style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Step Tabs - Hidden on mobile */}
                <div className="hidden sm:flex justify-between">
                    {steps.map((stepItem, idx) => {
                        const IconComponent = stepItem.icon;
                        const isActive = idx === step;
                        const isCompleted = idx < step;

                        return (
                            <div key={stepItem.label} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isArabic ? 'ml-2' : 'mr-2'} ${isActive || isCompleted
                                        ? 'gradient-bg text-white'
                                        : 'bg-[var(--container-color)] text-[var(--sub-text-color)]'
                                    }`}>
                                    <IconComponent size={16} />
                                </div>
                                <span className={`text-sm font-medium ${isActive || isCompleted
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
                {step === 0 && <PersonalInfoStep onNext={() => setStep(1)} />}
                {step === 1 && <ProfessionalInfoStep onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                {step === 2 && <DocumentsStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                {step === 3 && <DoneStep onBack={() => setStep(2)} />}
            </div>
        </div>
    );
}

// Step 1: Personal Information
function PersonalInfoStep({ onNext }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    return (
        <div className="space-y-6">
            {/* Avatar Upload */}
            <div className={`flex ${isArabic ? 'justify-end' : 'justify-start'} mb-6`}>
                <div className="w-20 h-20 rounded-xl bg-[var(--container-color)] border-2 border-dashed border-[var(--border-color)] flex items-center justify-center cursor-pointer hover:bg-[var(--hover-color)] transition-colors">
                    <Camera className="text-[var(--sub-text-color)]" size={24} />
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.personalInfo.firstName")}
                    type="text"
                />
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.personalInfo.lastName")}
                    type="text"
                />
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.personalInfo.mobileNumber")}
                    type="tel"
                />
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.personalInfo.emailAddress")}
                    type="email"
                />
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.personalInfo.dateOfBirth")}
                    type="date"
                />
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.personalInfo.status")}</option>
                    <option value="active">{t("employees.newEmployeeForm.personalInfo.active")}</option>
                    <option value="inactive">{t("employees.newEmployeeForm.personalInfo.inactive")}</option>
                </select>
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.personalInfo.gender")}</option>
                    <option value="male">{t("employees.newEmployeeForm.personalInfo.male")}</option>
                    <option value="female">{t("employees.newEmployeeForm.personalInfo.female")}</option>
                    <option value="other">{t("employees.newEmployeeForm.personalInfo.other")}</option>
                </select>
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.personalInfo.nationality")}</option>
                    <option value="us">{t("employees.newEmployeeForm.personalInfo.unitedStates")}</option>
                    <option value="uk">{t("employees.newEmployeeForm.personalInfo.unitedKingdom")}</option>
                    <option value="ca">{t("employees.newEmployeeForm.personalInfo.canada")}</option>
                </select>
                <input
                    className="form-input md:col-span-2"
                    placeholder={t("employees.newEmployeeForm.personalInfo.address")}
                    type="text"
                />
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary">{t("employees.newEmployeeForm.buttons.cancel")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("employees.newEmployeeForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 2: Professional Information
function ProfessionalInfoStep({ onNext, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2">
                    <input
                        className="form-input flex-1"
                        placeholder={t("employees.newEmployeeForm.professionalInfo.employeeId")}
                        type="text"
                    />
                    <button type="button" className="btn-primary px-4 whitespace-nowrap">{t("employees.newEmployeeForm.professionalInfo.generate")}</button>
                </div>
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.professionalInfo.userName")}
                    type="text"
                />
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.professionalInfo.selectEmployeeRole")}</option>
                    <option value="manager">{t("employees.newEmployeeForm.professionalInfo.manager")}</option>
                    <option value="developer">{t("employees.newEmployeeForm.professionalInfo.developer")}</option>
                    <option value="designer">{t("employees.newEmployeeForm.professionalInfo.designer")}</option>
                </select>
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.personalInfo.emailAddress")}
                    type="email"
                />
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.professionalInfo.selectDepartment")}</option>
                    <option value="hr">{t("employees.newEmployeeForm.professionalInfo.humanResources")}</option>
                    <option value="it">{t("employees.newEmployeeForm.professionalInfo.it")}</option>
                    <option value="finance">{t("employees.newEmployeeForm.professionalInfo.finance")}</option>
                </select>
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.professionalInfo.managerSupervisor")}
                    type="text"
                />
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.professionalInfo.selectWorkingDays")}</option>
                    <option value="5">{t("employees.newEmployeeForm.professionalInfo.fiveDays")}</option>
                    <option value="6">{t("employees.newEmployeeForm.professionalInfo.sixDays")}</option>
                </select>
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.professionalInfo.selectEmploymentType")}</option>
                    <option value="full-time">{t("employees.newEmployeeForm.professionalInfo.fullTime")}</option>
                    <option value="part-time">{t("employees.newEmployeeForm.professionalInfo.partTime")}</option>
                    <option value="contract">{t("employees.newEmployeeForm.professionalInfo.contract")}</option>
                </select>
                <select className="form-input">
                    <option value="">{t("employees.newEmployeeForm.professionalInfo.selectOfficeLocation")}</option>
                    <option value="main">{t("employees.newEmployeeForm.professionalInfo.mainOffice")}</option>
                    <option value="branch">{t("employees.newEmployeeForm.professionalInfo.branchOffice")}</option>
                </select>
                <input
                    className="form-input"
                    placeholder={t("employees.newEmployeeForm.professionalInfo.selectJoiningDate")}
                    type="date"
                />
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>{t("employees.newEmployeeForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("employees.newEmployeeForm.buttons.next")}</button>
            </div>
        </div>
    );
}

// Step 3: Documents
function DocumentsStep({ onNext, onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload label={t("employees.newEmployeeForm.documents.uploadProofOfIdentity")} />
                <FileUpload label={t("employees.newEmployeeForm.documents.uploadEmploymentContract")} />
                <FileUpload label={t("employees.newEmployeeForm.documents.uploadCertificatesQualifications")} optional />
                <FileUpload label={t("employees.newEmployeeForm.documents.uploadSocialInsuranceDocs")} />
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} gap-3 pt-6`}>
                <button type="button" className="btn-secondary" onClick={onBack}>{t("employees.newEmployeeForm.buttons.back")}</button>
                <button type="button" className="btn-primary" onClick={onNext}>{t("employees.newEmployeeForm.buttons.next")}</button>
            </div>
        </div>
    );
}

function FileUpload({ label, optional }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = (files) => {
        const file = files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert(t("employees.newEmployeeForm.documents.invalidFileType"));
                return;
            }

            // Validate file size (e.g., max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert(t("employees.newEmployeeForm.documents.fileSizeLimit"));
                return;
            }

            setUploadedFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
    };

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files);
    };

    const removeFile = () => {
        setUploadedFile(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-color)]">
                {label} {optional && <span className="text-[var(--sub-text-color)]">{t("employees.newEmployeeForm.documents.optional")}</span>}
            </label>

            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging
                    ? 'border-[var(--accent-color)] bg-[var(--hover-color)]'
                    : 'border-[var(--border-color)] bg-[var(--container-color)] hover:bg-[var(--hover-color)]'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById(`file-input-${label.replace(/\s+/g, '-').toLowerCase()}`).click()}
            >
                <input
                    id={`file-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    type="file"
                    accept=".jpeg,.jpg,.pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                {uploadedFile ? (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 mx-auto mb-3 gradient-bg rounded-full flex items-center justify-center">
                            <FileText className="text-white" size={20} />
                        </div>
                        <p className="text-sm font-medium text-[var(--text-color)] mb-1">
                            {uploadedFile.name}
                        </p>
                        <p className="text-xs text-[var(--sub-text-color)] mb-2">
                            {formatFileSize(uploadedFile.size)}
                        </p>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                            className="text-xs text-[var(--error-color)] hover:underline"
                        >
                            {t("employees.newEmployeeForm.documents.removeFile")}
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="w-12 h-12 mx-auto mb-3 gradient-bg rounded-full flex items-center justify-center">
                            <Upload className="text-white" size={20} />
                        </div>
                        <p className="text-sm text-[var(--sub-text-color)] mb-1">
                            {t("employees.newEmployeeForm.documents.dragDrop")} <span className="text-[var(--accent-color)] font-medium">{t("employees.newEmployeeForm.documents.chooseFile")}</span> {t("employees.newEmployeeForm.documents.toUpload")}
                        </p>
                        <p className="text-xs text-[var(--sub-text-color)]">
                            {t("employees.newEmployeeForm.documents.supportedFormats")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Step 4: Done
function DoneStep({ onBack }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--success-color)] flex items-center justify-center">
                <Check className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2">{t("employees.newEmployeeForm.success.title")}</h2>
            <p className="text-[var(--sub-text-color)] mb-8">{t("employees.newEmployeeForm.success.message")}</p>
            <button type="button" className="btn-secondary" onClick={onBack}>{t("employees.newEmployeeForm.buttons.back")}</button>
        </div>
    );
}