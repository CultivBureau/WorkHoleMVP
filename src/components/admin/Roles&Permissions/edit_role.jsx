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

    return (
        <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-semibold text-[var(--text-color)]">
                    Edit Role
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-[var(--sub-text-color)]" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Role Name */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                        Role Name
                    </label>
                    <input
                        type="text"
                        value={formData.roleName}
                        onChange={(e) => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                        className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                        placeholder="Enter role name"
                    />
                </div>

                {/* Time & Attendance */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-color)] flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--accent-color)] rounded"></div>
                        Time & Attendance
                    </h3>
                    <div className="space-y-2 ml-5">
                        {[
                            { key: 'clockInOut', label: 'Clock In/Out' },
                            { key: 'editAttendanceLogic', label: 'Edit Attendance Logic' },
                            { key: 'viewAttendanceReports', label: 'View Attendance Reports' },
                            { key: 'approveLateArrivalJustifications', label: 'Approve Late Arrival Justifications' }
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.timeAndAttendance[item.key]}
                                    onChange={() => handlePermissionChange('timeAndAttendance', item.key)}
                                    className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]"
                                />
                                <span className="text-sm text-[var(--text-color)]">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tasks & Projects */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-color)] flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--accent-color)] rounded"></div>
                        Tasks & Projects
                    </h3>
                    <div className="space-y-2 ml-5">
                        {[
                            { key: 'createTasks', label: 'Create Tasks' },
                            { key: 'assignTasks', label: 'Assign Tasks' },
                            { key: 'changeTaskStatus', label: 'Change Task Status' },
                            { key: 'viewAllTasksAndProjects', label: 'View All Tasks & Projects' }
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.tasksAndProjects[item.key]}
                                    onChange={() => handlePermissionChange('tasksAndProjects', item.key)}
                                    className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]"
                                />
                                <span className="text-sm text-[var(--text-color)]">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Leave Management */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-color)] flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--accent-color)] rounded"></div>
                        Leave Management
                    </h3>
                    <div className="space-y-2 ml-5">
                        {[
                            { key: 'requestLeaves', label: 'Request Leaves' },
                            { key: 'approveLeaves', label: 'Approve/Reject Leave Requests' },
                            { key: 'viewLeaveCalendar', label: 'View Leave Calendar' },
                            { key: 'createProjects', label: 'Create Projects' }
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.leaveManagement[item.key]}
                                    onChange={() => handlePermissionChange('leaveManagement', item.key)}
                                    className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]"
                                />
                                <span className="text-sm text-[var(--text-color)]">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Employee Management */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-color)] flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--accent-color)] rounded"></div>
                        Employee Management
                    </h3>
                    <div className="space-y-2 ml-5">
                        {[
                            { key: 'addEmployee', label: 'Add Employee' },
                            { key: 'viewTeam', label: 'View Team' },
                            { key: 'viewEmployeePerformance', label: 'View Employee Performance' }
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.employeeManagement[item.key]}
                                    onChange={() => handlePermissionChange('employeeManagement', item.key)}
                                    className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]"
                                />
                                <span className="text-sm text-[var(--text-color)]">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* HR & Admin Tools */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-color)] flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--accent-color)] rounded"></div>
                        HR & Admin Tools
                    </h3>
                    <div className="space-y-2 ml-5">
                        {[
                            { key: 'viewReportsAndAnalytics', label: 'View Reports And Analytics' },
                            { key: 'accessPayroll', label: 'Access Payroll' },
                            { key: 'managePolicyCompliance', label: 'Manage Policy Compliance' },
                            { key: 'accessRecruitmentTools', label: 'Access Recruitment Tools' }
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.hrAndAdminTools[item.key]}
                                    onChange={() => handlePermissionChange('hrAndAdminTools', item.key)}
                                    className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)]"
                                />
                                <span className="text-sm text-[var(--text-color)]">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="border-t border-[var(--border-color)] p-4 bg-[var(--bg-color)]">
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-color)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        <Check className="w-4 h-4" />
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="w-full px-4 py-3 border border-[var(--border-color)] text-[var(--text-color)] rounded-lg font-medium hover:bg-[var(--hover-color)] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRole;