import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, RotateCcw, Clock, MapPin, Calendar, User } from "lucide-react";
import AddShiftPopup from "./add-shift-popup";
import EditShiftPopup from "./edit-shift-popup";
import { useGetAllShiftsQuery, useDeleteShiftMutation, useUpdateShiftMutation } from "../../../services/apis/ShiftApi";
import { getCompanyId } from "../../../utils/page";
import toast from "react-hot-toast";

export default function AllShifts() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("active"); // "active", "inactive", or "all"
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [viewShiftId, setViewShiftId] = useState(null);
    const [editShiftId, setEditShiftId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRefs = useRef({});
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 10;

    const [deleteShift, { isLoading: isDeleting }] = useDeleteShiftMutation();
    const [updateShift, { isLoading: isRestoring }] = useUpdateShiftMutation();

    // Convert statusFilter string to number for API
    // API spec: status values are 0, 1, 2
    // 0 = active, 1 = inactive, 2 = all
    // Note: If API doesn't support status=1 properly, we'll fetch all and filter client-side
    const statusNumber = 
        statusFilter === "active" ? 0 : 
        statusFilter === "inactive" ? 2 : // Fetch all when filtering inactive, then filter client-side
        statusFilter === "all" ? 2 : 2;

    // Reset page number when status filter changes
    useEffect(() => {
        setPageNumber(1);
    }, [statusFilter]);

    const { data: shiftsData, isLoading, error, refetch } = useGetAllShiftsQuery({
        pageNumber,
        pageSize,
        status: statusNumber,
    }, {
        // Force refetch when status changes
        refetchOnMountOrArgChange: true,
    });

    const shifts = shiftsData?.value || [];
    
    // Debug: Log the API response
    useEffect(() => {
        console.log('Status Filter:', statusFilter, 'Status Number:', statusNumber);
        console.log('Shifts received:', shifts);
        console.log('Shifts with status breakdown:', shifts.map(s => ({ 
            id: s.id, 
            name: s.name, 
            status: s.status, 
            statusType: typeof s.status 
        })));
    }, [statusFilter, statusNumber, shifts]);

    // Client-side filtering - always filter client-side for inactive since API status=1 doesn't work
    const filteredByStatus = useMemo(() => {
        if (statusFilter === "inactive") {
            // Filter for inactive shifts (status === false or status === 1)
            return shifts.filter(shift => {
                const statusValue = shift.status === true ? 0 : shift.status === false ? 1 : shift.status;
                return statusValue === 1; // Inactive
            });
        } else if (statusFilter === "active") {
            // Filter for active shifts (status === true or status === 0)
            return shifts.filter(shift => {
                const statusValue = shift.status === true ? 0 : shift.status === false ? 1 : shift.status;
                return statusValue === 0; // Active
            });
        }
        // "all" - return all shifts
        return shifts;
    }, [shifts, statusFilter]);

    const handleAddNewShift = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    const handleShiftCreated = () => {
        setShowAddPopup(false);
        refetch();
    };

    const handleViewShift = (shiftId) => {
        setViewShiftId(shiftId);
        setEditShiftId(null);
        setShowEditPopup(true);
        setOpenMenuId(null);
    };

    const handleEditShift = (shiftId) => {
        setEditShiftId(shiftId);
        setViewShiftId(null);
        setShowEditPopup(true);
        setOpenMenuId(null);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setViewShiftId(null);
        setEditShiftId(null);
    };

    const handleShiftUpdated = () => {
        handleCloseEditPopup();
        refetch();
    };

    const handleDeleteShift = async (shiftId) => {
        if (!window.confirm(t('shifts.delete.confirm', 'Are you sure you want to delete this shift?'))) {
            setOpenMenuId(null);
            return;
        }

        try {
            await deleteShift(shiftId).unwrap();
            toast.success(t('shifts.delete.success', 'Shift deleted successfully'));
            refetch();
        } catch (error) {
            const errorMessage = error?.data?.errorMessage || error?.data?.message || error?.message || t('shifts.delete.error', 'Failed to delete shift');
            toast.error(errorMessage);
        }
        setOpenMenuId(null);
    };

    const handleRestoreShift = async (shift) => {
        if (!window.confirm(t('shifts.restore.confirm', 'Are you sure you want to restore this shift?'))) {
            setOpenMenuId(null);
            return;
        }

        const companyId = getCompanyId();
        if (!companyId) {
            toast.error(t('shifts.validation.companyIdRequired', 'Company ID is required'));
            setOpenMenuId(null);
            return;
        }

        // Convert workDays if needed
        const workDays = Array.isArray(shift.workDays) ? shift.workDays : [];

        // Prepare payload with existing shift data
        // Note: This uses PUT to update the shift, which may restore it if the backend
        // handles restoration through PUT. If not, a separate restore endpoint may be needed.
        const payload = {
            name: shift.name || '',
            latitude: shift.latitude || 0,
            longitude: shift.longitude || 0,
            radiusMeters: shift.radiusMeters || 0,
            gracePeriodMinutes: shift.gracePeriodMinutes || 0,
            maxOvertimeMinutes: shift.maxOvertimeMinutes || 0,
            startTime: shift.startTime || '',
            endTime: shift.endTime || '',
            workDays: workDays,
            isLocation: shift.isLocation || false,
            isFaceRecognition: shift.isFaceRecognition || false,
            isDevice: shift.isDevice || false,
            overtimeAllowed: shift.overtimeAllowed || false,
            companyId: companyId,
        };

        try {
            await updateShift({ id: shift.id, ...payload }).unwrap();
            toast.success(t('shifts.restore.success', 'Shift restored successfully'));
            refetch();
        } catch (error) {
            const errorMessage = error?.data?.errorMessage || error?.data?.message || error?.message || t('shifts.restore.error', 'Failed to restore shift');
            toast.error(errorMessage);
        }
        setOpenMenuId(null);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    // Format time from HH:MM:SS to HH:MM for display
    const formatTime = (time) => {
        if (!time) return '-';
        if (time.length >= 5) return time.substring(0, 5);
        return time;
    };

    // Format work days for display
    // workDays can be either:
    // 1. An array of numbers (1-7) - legacy format
    // 2. A single number representing bit flags (Saturday=1, Sunday=2, Monday=4, Tuesday=8, Wednesday=16, Thursday=32, Friday=64)
    const formatWorkDays = (workDays) => {
        if (!workDays) return '-';

        // Bit flag values for each day
        const dayFlags = {
            1: t('shifts.days.saturday', 'Saturday'),    // 1 << 0 = 1
            2: t('shifts.days.sunday', 'Sunday'),          // 1 << 1 = 2
            4: t('shifts.days.monday', 'Monday'),          // 1 << 2 = 4
            8: t('shifts.days.tuesday', 'Tuesday'),        // 1 << 3 = 8
            16: t('shifts.days.wednesday', 'Wednesday'),   // 1 << 4 = 16
            32: t('shifts.days.thursday', 'Thursday'),     // 1 << 5 = 32
            64: t('shifts.days.friday', 'Friday'),         // 1 << 6 = 64
        };

        // If workDays is an array, treat as legacy format (1-7)
        if (Array.isArray(workDays)) {
            if (workDays.length === 0) return '-';
            // Legacy mapping for array format
            const legacyDayNames = {
                1: t('shifts.days.monday', 'Monday'),
                2: t('shifts.days.tuesday', 'Tuesday'),
                3: t('shifts.days.wednesday', 'Wednesday'),
                4: t('shifts.days.thursday', 'Thursday'),
                5: t('shifts.days.friday', 'Friday'),
                6: t('shifts.days.saturday', 'Saturday'),
                7: t('shifts.days.sunday', 'Sunday'),
            };
            return workDays.map(day => legacyDayNames[day]).filter(Boolean).join(', ');
        }

        // If workDays is a number, treat as bit flag
        if (typeof workDays === 'number') {
            if (workDays === 0) return '-';

            const selectedDays = [];
            // Check each bit flag
            Object.keys(dayFlags).map(Number).forEach(flag => {
                if ((workDays & flag) === flag) {
                    selectedDays.push(dayFlags[flag]);
                }
            });

            return selectedDays.length > 0 ? selectedDays.join(', ') : '-';
        }

        return '-';
    };

    // Filter shifts by search term (applied after status filtering)
    const filteredShifts = useMemo(() => {
        return filteredByStatus.filter(shift =>
            shift.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shift.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [filteredByStatus, searchTerm]);

    return (
        <>
            {showAddPopup && (
                <AddShiftPopup
                    isOpen={showAddPopup}
                    onClose={handleClosePopup}
                    onSave={handleShiftCreated}
                />
            )}
            {showEditPopup && (
                <EditShiftPopup
                    isOpen={showEditPopup}
                    onClose={handleCloseEditPopup}
                    shiftId={viewShiftId || editShiftId}
                    mode={viewShiftId ? 'view' : 'edit'}
                    onSave={handleShiftUpdated}
                />
            )}
            <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
                {/* Search, Filter and Action Buttons */}
                <div className={`flex flex-col gap-4 ${isArabic ? '' : ''}`}>
                    <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 ${isArabic ? 'right-3' : 'left-3'}`}
                                style={{ color: 'var(--sub-text-color)' }}
                            />
                            <input
                                type="text"
                                placeholder={t("shifts.search.placeholder", "Search shifts...")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                                style={{
                                    borderColor: 'var(--border-color)',
                                    backgroundColor: 'var(--bg-color)',
                                    color: 'var(--text-color)',
                                    paddingLeft: isArabic ? '16px' : '40px',
                                    paddingRight: isArabic ? '40px' : '16px',
                                    focusRingColor: 'var(--accent-color)',
                                    textAlign: isArabic ? 'right' : 'left'
                                }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            {/* Status Filter */}
                            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <Filter className="text-[var(--sub-text-color)]" size={16} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--bg-color)',
                                        color: 'var(--text-color)',
                                        focusRingColor: 'var(--accent-color)',
                                    }}
                                >
                                    <option value="all">{t("shifts.filter.all", "All")}</option>
                                    <option value="active">{t("shifts.filter.active", "Active")}</option>
                                    <option value="inactive">{t("shifts.filter.inactive", "Inactive")}</option>
                                </select>
                            </div>

                            <button
                                onClick={handleAddNewShift}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">{t("shifts.addNewShift", "Add New Shift")}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shifts Grid - 3 cards per row on large screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
                                <div className="text-[var(--sub-text-color)]">{t('shifts.loading', 'Loading shifts...')}</div>
                            </div>
                        </div>
                    ) : filteredShifts.length > 0 ? (
                        filteredShifts.map((shift) => {
                            // Handle status properly - can be boolean (true/false) or numeric (0=active, 1=inactive, 2=all)
                            const statusValue = shift.status === true ? 0 : shift.status === false ? 1 : shift.status;
                            const isActive = statusValue === 0;
                            const isMenuOpen = openMenuId === shift.id;

                            return (
                                <div
                                    key={shift.id}
                                    className="bg-[var(--bg-color)] rounded-2xl p-6 border border-[var(--border-color)] hover:shadow-xl hover:border-[var(--accent-color)]/30 transition-all duration-300 relative group"
                                >
                                    {/* Top Section - Header with Status and Actions */}
                                    <div className={`flex items-start justify-between mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                        {/* Shift Name and Status Badge */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                                        <h3 className={`text-lg font-bold text-[var(--text-color)] truncate ${isArabic ? 'text-right' : 'text-left'}`}>
                                                            {shift.name}
                                                        </h3>
                                                        <span
                                                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                                                            style={{
                                                                backgroundColor: isActive ? 'var(--success-color)' : 'var(--error-color)',
                                                                color: 'white',
                                                                opacity: isActive ? 0.9 : 0.9
                                                            }}
                                                        >
                                                            {isActive ? t('shifts.status.active', 'Active') : t('shifts.status.inactive', 'Inactive')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Menu */}
                                        <div className={`${isArabic ? 'mr-2' : 'ml-2'} flex-shrink-0`} ref={el => menuRefs.current[shift.id] = el}>
                                            <button
                                                onClick={() => setOpenMenuId(isMenuOpen ? null : shift.id)}
                                                className="p-2 rounded-lg hover:bg-[var(--hover-color)] transition-colors opacity-0 group-hover:opacity-100"
                                                style={{ color: 'var(--sub-text-color)' }}
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isMenuOpen && (
                                                <div className={`absolute ${isArabic ? 'left-0' : 'right-0'} top-16 mt-2 w-48 rounded-xl shadow-2xl border z-50`}
                                                    style={{
                                                        backgroundColor: 'var(--bg-color)',
                                                        borderColor: 'var(--border-color)'
                                                    }}
                                                >
                                                    <div className="py-2">
                                                        <button
                                                            onClick={() => handleViewShift(shift.id)}
                                                            className={`w-full px-4 py-2.5 text-sm hover:bg-[var(--hover-color)] flex items-center gap-3 transition-colors ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                                                            style={{ color: 'var(--text-color)' }}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            {t('shifts.actions.view', 'View Details')}
                                                        </button>
                                                        {isActive && (
                                                            <button
                                                                onClick={() => handleEditShift(shift.id)}
                                                                className={`w-full px-4 py-2.5 text-sm hover:bg-[var(--hover-color)] flex items-center gap-3 transition-colors ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                                                                style={{ color: 'var(--text-color)' }}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                {t('shifts.actions.edit', 'Edit')}
                                                            </button>
                                                        )}
                                                        {isActive ? (
                                                            <button
                                                                onClick={() => handleDeleteShift(shift.id)}
                                                                disabled={isDeleting}
                                                                className={`w-full px-4 py-2.5 text-sm hover:bg-[var(--hover-color)] flex items-center gap-3 disabled:opacity-50 transition-colors ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                                                                style={{ color: 'var(--error-color)' }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                {t('shifts.actions.delete', 'Delete')}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRestoreShift(shift)}
                                                                disabled={isRestoring}
                                                                className={`w-full px-4 py-2.5 text-sm hover:bg-[var(--hover-color)] flex items-center gap-3 disabled:opacity-50 transition-colors ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                                                                style={{ color: 'var(--info-color)' }}
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                                {t('shifts.actions.restore', 'Restore')}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shift Details */}
                                    <div className="space-y-3">
                                        {/* Time Range */}
                                        <div className={`flex items-center gap-3 p-3 bg-[var(--container-color)] rounded-xl ${isArabic ? 'flex-row-reverse' : ''}`}>

                                            <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <p className="text-xs text-[var(--sub-text-color)] font-medium">
                                                    {t('shifts.details.workingHours', 'Working Hours')}
                                                </p>
                                                <p className="text-sm font-semibold text-[var(--text-color)]">
                                                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Work Days */}
                                        <div className={`flex items-center gap-3 p-3 bg-[var(--container-color)] rounded-xl ${isArabic ? 'flex-row-reverse' : ''}`}>
                                            <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <p className="text-xs text-[var(--sub-text-color)] font-medium">
                                                    {t('shifts.details.workingDays', 'Working Days')}
                                                </p>
                                                <p className="text-sm font-semibold text-[var(--text-color)] line-clamp-2">
                                                    {formatWorkDays(shift.workDays)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Additional Features */}
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {shift.isLocation && (
                                                <div
                                                    className={`flex items-center gap-2 p-2 rounded-lg ${isArabic ? 'flex-row-reverse' : ''}`}
                                                    style={{ backgroundColor: 'var(--container-color)' }}
                                                >
                                                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-color)' }} />
                                                    <span className="text-xs font-medium" style={{ color: 'var(--text-color)' }}>
                                                        {t('shifts.location.enabled', 'Location')}
                                                    </span>
                                                </div>
                                            )}

                                            {shift.gracePeriodMinutes > 0 && (
                                                <div
                                                    className={`flex items-center gap-2 p-2 rounded-lg ${isArabic ? 'flex-row-reverse' : ''}`}
                                                    style={{ backgroundColor: 'var(--container-color)' }}
                                                >
                                                    <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--warning-color)' }} />
                                                    <span className="text-xs font-medium" style={{ color: 'var(--text-color)' }}>
                                                        {shift.gracePeriodMinutes}m {t('shifts.grace', 'Grace')}
                                                    </span>
                                                </div>
                                            )}

                                            {shift.isFaceRecognition && (
                                                <div
                                                    className={`flex items-center gap-2 p-2 rounded-lg ${isArabic ? 'flex-row-reverse' : ''}`}
                                                    style={{ backgroundColor: 'var(--container-color)' }}
                                                >
                                                    <User className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--info-color)' }} />
                                                    <span className="text-xs font-medium" style={{ color: 'var(--text-color)' }}>
                                                        {t('shifts.faceRecognition', 'Face ID')}
                                                    </span>
                                                </div>
                                            )}

                                            {shift.overtimeAllowed && (
                                                <div
                                                    className={`flex items-center gap-2 p-2 rounded-lg ${isArabic ? 'flex-row-reverse' : ''}`}
                                                    style={{ backgroundColor: 'var(--container-color)' }}
                                                >
                                                    <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-color)' }} />
                                                    <span className="text-xs font-medium" style={{ color: 'var(--text-color)' }}>
                                                        {t('shifts.overtime', 'Overtime')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-[var(--container-color)] rounded-full flex items-center justify-center mb-4">
                                <Search className="text-[var(--sub-text-color)]" size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--text-color)] mb-2">
                                {t("shifts.empty.title", "No shifts found")}
                            </h3>
                            <p className="text-[var(--sub-text-color)] max-w-sm">
                                {searchTerm
                                    ? t("shifts.empty.search", { searchTerm: searchTerm }, `No shifts match "${searchTerm}". Try adjusting your search.`)
                                    : t("shifts.empty.message", "No shifts available at the moment.")
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                {filteredShifts.length > 0 && (
                    <div className={`text-sm text-[var(--sub-text-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                        {(() => {
                            const statusText = statusFilter === "active" ? t("shifts.resultsActive", "active") : t("shifts.resultsInactive", "inactive");
                            const pluralText = filteredShifts.length !== 1 ? t("shifts.resultsPlural", "s") : "";
                            return t("shifts.results", {
                                count: filteredShifts.length,
                                status: statusText,
                                plural: pluralText
                            });
                        })()}
                    </div>
                )}
            </div>
        </>
    );
}

