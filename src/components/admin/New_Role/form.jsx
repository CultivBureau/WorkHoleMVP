import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const NewRoleForm = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        roleName: '',
        description: '',
        permissions: {
            timeAndAttendance: {
                clockInOut: false,
                editAttendanceLogs: false,
                viewAttendanceReports: false,
                approveLateArrivalJustifications: false
            },
            tasksAndProjects: {
                createTasks: false,
                assignTasksToOthers: false,
                changeTaskStatus: false,
                viewAllTasksProjects: false,
                createProjects: false
            },
            employeeManagement: {
                addEditEmployees: false,
                assignRoles: false,
                viewEmployeeProfiles: false,
                deactivateEmployees: false
            },
            leaveManagement: {
                requestLeave: false,
                approveRejectLeaveRequests: false,
                editLeaveBalance: false,
                viewLeaveCalendar: false
            },
            hrAndAdminTools: {
                viewReportsDashboard: false,
                editCompanySettings: false,
                manageBreakCategories: false,
                accessPayrollData: false
            }
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (category, permission) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [category]: {
                    ...prev.permissions[category],
                    [permission]: !prev.permissions[category][permission]
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
        navigate('/pages/admin/Roles&Permissions');
    };

    const handleBack = () => {
        navigate('/pages/admin/Roles&Permissions');
    };

    // Permission sections for rendering
    const permissionSections = [
        {
            title: t('roles.editRole.categories.timeAndAttendance'),
            category: 'timeAndAttendance',
            items: [
                { key: 'clockInOut', label: t('roles.editRole.permissions.clockInOut') },
                { key: 'editAttendanceLogs', label: t('roles.permissionsList.editAttendanceLogs') },
                { key: 'viewAttendanceReports', label: t('roles.permissionsList.viewAttendanceReports') },
                { key: 'approveLateArrivalJustifications', label: t('roles.permissionsList.approveLateArrivalJustifications') }
            ]
        },
        {
            title: t('roles.editRole.categories.tasksAndProjects'),
            category: 'tasksAndProjects',
            items: [
                { key: 'createTasks', label: t('roles.permissionsList.createTasks') },
                { key: 'assignTasksToOthers', label: t('roles.permissionsList.assignTasksToOthers') },
                { key: 'changeTaskStatus', label: t('roles.permissionsList.changeTaskStatus') },
                { key: 'viewAllTasksProjects', label: t('roles.permissionsList.viewAllTasksProjects') },
                { key: 'createProjects', label: t('roles.permissionsList.createProjects') }
            ]
        },
        {
            title: t('roles.editRole.categories.employeeManagement'),
            category: 'employeeManagement',
            items: [
                { key: 'addEditEmployees', label: t('roles.permissionsList.addEditEmployees') },
                { key: 'assignRoles', label: t('roles.permissionsList.assignRoles') },
                { key: 'viewEmployeeProfiles', label: t('roles.permissionsList.viewEmployeeProfiles') },
                { key: 'deactivateEmployees', label: t('roles.permissionsList.deactivateEmployees') }
            ]
        },
        {
            title: t('roles.editRole.categories.leaveManagement'),
            category: 'leaveManagement',
            items: [
                { key: 'requestLeave', label: t('roles.permissionsList.requestLeave') },
                { key: 'approveRejectLeaveRequests', label: t('roles.permissionsList.approveRejectLeaveRequests') },
                { key: 'editLeaveBalance', label: t('roles.permissionsList.editLeaveBalance') },
                { key: 'viewLeaveCalendar', label: t('roles.permissionsList.viewLeaveCalendar') }
            ]
        },
        {
            title: t('roles.editRole.categories.hrAndAdminTools'),
            category: 'hrAndAdminTools',
            items: [
                { key: 'viewReportsDashboard', label: t('roles.permissionsList.viewReportsDashboard') },
                { key: 'editCompanySettings', label: t('roles.permissionsList.editCompanySettings') },
                { key: 'manageBreakCategories', label: t('roles.permissionsList.manageBreakCategories') },
                { key: 'accessPayrollData', label: t('roles.permissionsList.accessPayrollData') }
            ]
        }
    ];

    return (
        <div className="w-full" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Header section */}
            <div className="mb-6">
            <h1 
                    className={`text-xl font-bold text-[var(--text-color)] ${isArabic ? 'text-right' : 'text-left'}`}
                    dir={isArabic ? 'rtl' : 'ltr'}
                >
                    {t('roles.addNewRole')}
                </h1>
                <div className={`flex items-center gap-2 text-[var(--sub-text-color)] text-sm mb-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                    <span
                        className="cursor-pointer hover:text-[var(--accent-color)]"
                        onClick={handleBack}
                        style={{ textAlign: isArabic ? 'right' : 'left' }}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        {t('roles.allRoles')}
                    </span>
                    {isArabic ? (
                        <ChevronLeft className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                    <span 
                        className="text-[var(--text-color)]"
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        {t('roles.addNewRole')}
                    </span>
                </div>
                
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label 
                            className={`block text-sm font-medium text-[var(--text-color)] mb-1 ${isArabic ? 'text-right' : 'text-left'}`}
                            dir={isArabic ? 'rtl' : 'ltr'}
                        >
                            {t('roles.editRole.roleName')}
                        </label>
                        <input
                            type="text"
                            name="roleName"
                            value={formData.roleName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] ${isArabic ? 'text-right' : 'text-left'}`}
                            placeholder={t('roles.editRole.roleNamePlaceholder')}
                            dir={isArabic ? 'rtl' : 'ltr'}
                        />
                    </div>
                    <div>
                        <label 
                            className={`block text-sm font-medium text-[var(--text-color)] mb-1 ${isArabic ? 'text-right' : 'text-left'}`}
                            dir={isArabic ? 'rtl' : 'ltr'}
                        >
                            {t('roles.description')} <span className="text-[var(--sub-text-color)] text-xs">{t('roles.optional')}</span>
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] ${isArabic ? 'text-right' : 'text-left'}`}
                            placeholder={t('roles.descriptionPlaceholder')}
                            dir={isArabic ? 'rtl' : 'ltr'}
                        />
                    </div>
                </div>

                {/* Permissions section */}
                <div>
                    <h2 
                        className={`text-lg font-medium text-[var(--text-color)] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        {t('roles.permissions')}
                    </h2>
                    <p 
                        className={`text-sm text-[var(--sub-text-color)] mb-4 ${isArabic ? 'text-right' : 'text-left'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        {t('roles.permissionsDescription')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {permissionSections.map(section => (
                            <div key={section.category}>
                                <h3 
                                    className={`text-md font-semibold text-[var(--text-color)] mb-3 ${isArabic ? 'text-right' : 'text-left'}`}
                                    dir={isArabic ? 'rtl' : 'ltr'}
                                >
                                    {section.title}
                                </h3>
                                <div className="space-y-2">
                                    {section.items.map(item => (
                                        <label key={item.key} className={`flex items-center cursor-pointer ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions[section.category][item.key]}
                                                onChange={() => handleCheckboxChange(section.category, item.key)}
                                                className={`w-4 h-4 m-2 rounded border-2 border-[var(--border-color)] ${isArabic ? 'order-2' : 'order-1'}`}
                                                style={{ accentColor: 'var(--accent-color)' }}
                                            />
                                            <span 
                                                className={`text-sm text-[var(--text-color)] ${isArabic ? 'ml-2 text-right order-1' : 'ml-2 text-left order-2'}`}
                                                dir={isArabic ? 'rtl' : 'ltr'}
                                            >
                                                {item.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form actions */}
                <div className={`flex flex-col sm:flex-row justify-end gap-4 pt-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <button
                        type="button"
                        onClick={handleBack}
                        className={`px-6 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-color)] font-medium bg-[var(--bg-all)] hover:bg-[var(--sub-text-color-2)] transition-colors ${isArabic ? 'order-2' : 'order-1'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        {t('roles.back')}
                    </button>
                    <button
                        type="submit"
                        className={`px-6 py-2 gradient-bg text-white rounded-lg font-medium hover:opacity-90 transition-opacity ${isArabic ? 'order-1' : 'order-2'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        {t('roles.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewRoleForm;