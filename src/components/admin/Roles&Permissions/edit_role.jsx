import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EditRole = ({ isOpen, onClose, roleData, onSave }) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [formData, setFormData] = useState({
        roleName: '',
        permissions: {
            timeAndAttendance: {
                clockInOut: false,
                editAttendanceLogic: false,
                viewAttendanceReports: false,
                approveLateArrivalJustifications: false
            },
            tasksAndProjects: {
                createTasks: false,
                assignTasks: false,
                changeTaskStatus: false,
                viewAllTasksAndProjects: false
            },
            leaveManagement: {
                requestLeaves: false,
                approveLeaves: false,
                viewLeaveCalendar: false,
                createProjects: false
            },
            employeeManagement: {
                addEmployee: false,
                viewTeam: false,
                viewEmployeePerformance: false
            },
            hrAndAdminTools: {
                viewReportsAndAnalytics: false,
                accessPayroll: false,
                managePolicyCompliance: false,
                accessRecruitmentTools: false
            }
        }
    });

    useEffect(() => {
        if (roleData) {
            setFormData({
                roleName: roleData.role || '',
                permissions: {
                    timeAndAttendance: {
                        clockInOut: false,
                        editAttendanceLogic: false,
                        viewAttendanceReports: false,
                        approveLateArrivalJustifications: false
                    },
                    tasksAndProjects: {
                        createTasks: false,
                        assignTasks: false,
                        changeTaskStatus: false,
                        viewAllTasksAndProjects: false
                    },
                    leaveManagement: {
                        requestLeaves: false,
                        approveLeaves: false,
                        viewLeaveCalendar: false,
                        createProjects: false
                    },
                    employeeManagement: {
                        addEmployee: false,
                        viewTeam: false,
                        viewEmployeePerformance: false
                    },
                    hrAndAdminTools: {
                        viewReportsAndAnalytics: false,
                        accessPayroll: false,
                        managePolicyCompliance: false,
                        accessRecruitmentTools: false
                    }
                }
            });
        }
    }, [roleData]);

    const handlePermissionChange = (category, permission) => {
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

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1100;

    // Permission sections data with translations
    const permissionSections = [
        {
            title: t('roles.editRole.categories.timeAndAttendance'),
            category: 'timeAndAttendance',
            items: [
                { key: 'clockInOut', label: t('roles.editRole.permissions.clockInOut') },
                { key: 'editAttendanceLogic', label: t('roles.editRole.permissions.editAttendanceLogic') },
                { key: 'viewAttendanceReports', label: t('roles.editRole.permissions.viewAttendanceReports') },
                { key: 'approveLateArrivalJustifications', label: t('roles.editRole.permissions.approveLateArrivalJustifications') }
            ]
        },
        {
            title: t('roles.editRole.categories.tasksAndProjects'),
            category: 'tasksAndProjects',
            items: [
                { key: 'createTasks', label: t('roles.editRole.permissions.createTasks') },
                { key: 'assignTasks', label: t('roles.editRole.permissions.assignTasks') },
                { key: 'changeTaskStatus', label: t('roles.editRole.permissions.changeTaskStatus') },
                { key: 'viewAllTasksAndProjects', label: t('roles.editRole.permissions.viewAllTasksAndProjects') }
            ]
        },
        {
            title: t('roles.editRole.categories.leaveManagement'),
            category: 'leaveManagement',
            items: [
                { key: 'requestLeaves', label: t('roles.editRole.permissions.requestLeaves') },
                { key: 'approveLeaves', label: t('roles.editRole.permissions.approveLeaves') },
                { key: 'viewLeaveCalendar', label: t('roles.editRole.permissions.viewLeaveCalendar') },
                { key: 'createProjects', label: t('roles.editRole.permissions.createProjects') }
            ]
        },
        {
            title: t('roles.editRole.categories.employeeManagement'),
            category: 'employeeManagement',
            items: [
                { key: 'addEmployee', label: t('roles.editRole.permissions.addEmployee') },
                { key: 'viewTeam', label: t('roles.editRole.permissions.viewTeam') },
                { key: 'viewEmployeePerformance', label: t('roles.editRole.permissions.viewEmployeePerformance') }
            ]
        },
        {
            title: t('roles.editRole.categories.hrAndAdminTools'),
            category: 'hrAndAdminTools',
            items: [
                { key: 'viewReportsAndAnalytics', label: t('roles.editRole.permissions.viewReportsAndAnalytics') },
                { key: 'accessPayroll', label: t('roles.editRole.permissions.accessPayroll') },
                { key: 'managePolicyCompliance', label: t('roles.editRole.permissions.managePolicyCompliance') },
                { key: 'accessRecruitmentTools', label: t('roles.editRole.permissions.accessRecruitmentTools') }
            ]
        }
    ];

    // Mobile/Tablet Modal Layout
    if (isMobileOrTablet) {
        return (
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/20 bg-opacity-50 z-40"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] w-full max-w-md max-h-[90vh] flex flex-col"
                        style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                            <h2 className="text-lg font-semibold text-[var(--text-color)]">
                                {t('roles.editRole.title')}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[var(--sub-text-color)]" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Role Name */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                                    {t('roles.editRole.roleName')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.roleName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                                    placeholder={t('roles.editRole.roleNamePlaceholder')}
                                    dir={isArabic ? 'rtl' : 'ltr'}
                                />
                            </div>

                            {/* Permission Sections */}
                            {permissionSections.map((section) => (
                                <div key={section.category} className="space-y-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-[var(--text-color)] pb-2">
                                            {section.title}
                                        </h3>
                                        <div className="w-full h-px bg-[var(--border-color)]"></div>
                                    </div>
                                    <div className="space-y-2">
                                        {section.items.map(item => (
                                            <label key={item.key} className={`flex items-center gap-3 cursor-pointer ${isArabic ? 'flex-row-reverse' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions[section.category][item.key]}
                                                    onChange={() => handlePermissionChange(section.category, item.key)}
                                                    className="w-4 h-4 rounded border-2 border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)] focus:ring-2 checked:bg-[var(--accent-color)] checked:border-[var(--accent-color)]"
                                                    style={{
                                                        accentColor: 'var(--accent-color)'
                                                    }}
                                                />
                                                <span className="text-sm text-[var(--text-color)]">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Fixed Footer with Buttons */}
                        <div className="border-t border-[var(--border-color)] p-4 bg-[var(--bg-color)]">
                            <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-3 border border-[var(--border-color)] text-[var(--text-color)] rounded-lg font-medium hover:bg-[var(--hover-color)] transition-colors"
                                >
                                    {t('roles.editRole.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-color)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity ${isArabic ? 'flex-row-reverse' : ''}`}
                                >
                                    <Check className="w-4 h-4" />
                                    {t('roles.editRole.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Desktop Inline Layout
    return (
        <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] h-full min-h-0 flex flex-col"
            style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
                <h2 className="text-lg font-semibold text-[var(--text-color)]">
                    {t('roles.editRole.title')}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-[var(--sub-text-color)]" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {/* Role Name */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                        {t('roles.editRole.roleName')}
                    </label>
                    <input
                        type="text"
                        value={formData.roleName}
                        onChange={(e) => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                        className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                        placeholder={t('roles.editRole.roleNamePlaceholder')}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    />
                </div>

                {/* Permission Sections */}
                {permissionSections.map((section) => (
                    <div key={section.category} className="space-y-3">
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-color)] pb-2">
                                {section.title}
                            </h3>
                            <div className="w-full h-px bg-[var(--border-color)]"></div>
                        </div>
                        <div className="space-y-2">
                            {section.items.map(item => (
                                <label key={item.key} className={`flex items-center gap-3 cursor-pointer ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions[section.category][item.key]}
                                        onChange={() => handlePermissionChange(section.category, item.key)}
                                        className="w-4 h-4 rounded border-2 border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)] focus:ring-2 checked:bg-[var(--accent-color)] checked:border-[var(--accent-color)]"
                                        style={{
                                            accentColor: 'var(--accent-color)'
                                        }}
                                    />
                                    <span className="text-sm text-[var(--text-color)]">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="border-t border-[var(--border-color)] p-4 bg-[var(--bg-color)] flex-shrink-0">
                <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 border border-[var(--border-color)] text-[var(--text-color)] rounded-lg font-medium hover:bg-[var(--hover-color)] transition-colors"
                    >
                        {t('roles.editRole.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-color)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity ${isArabic ? 'flex-row-reverse' : ''}`}
                    >
                        <Check className="w-4 h-4" />
                        {t('roles.editRole.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRole;