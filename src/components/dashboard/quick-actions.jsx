import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Popup from "../common/Popup";
import CustomToast from "../common/CustomToast";
import ClockInPopup from "../Time_Tracking_Components/ClockInPopup/ClockInPopup";
import LeaveRequest from "../leave-requests/leave-request";

const QuickActions = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    // State for popups and toast
    const [activePopup, setActivePopup] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Custom toast function
    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    const closePopup = () => {
        setActivePopup(null);
    };

    const actions = [
        {
            id: 'clockIn',
            icon: "/assets/quick_actions/clock_in.svg",
            title: t("dashboard.quickActions.clockIn.title"),
            subtitle: t("dashboard.quickActions.clockIn.subtitle"),
            implemented: true,
        },
        {
            id: 'requestLeave',
            icon: "/assets/quick_actions/leave.svg",
            title: t("dashboard.quickActions.requestLeave.title"),
            subtitle: t("dashboard.quickActions.requestLeave.subtitle"),
            implemented: true,
        },
        {
            id: 'newTask',
            icon: "/assets/quick_actions/task.svg",
            title: t("dashboard.quickActions.newTask.title"),
            subtitle: t("dashboard.quickActions.newTask.subtitle"),
            implemented: false,
        },
        {
            id: 'myKpis',
            icon: "/assets/quick_actions/kpis.svg",
            title: t("dashboard.quickActions.myKpis.title"),
            subtitle: t("dashboard.quickActions.myKpis.subtitle"),
            implemented: false,
        },
        {
            id: 'askAi',
            icon: "/assets/quick_actions/ai.svg",
            title: t("dashboard.quickActions.askAi.title"),
            subtitle: t("dashboard.quickActions.askAi.subtitle"),
            implemented: false,
        },
        {
            id: 'myTasks',
            icon: "/assets/quick_actions/my_tasks.svg",
            title: t("dashboard.quickActions.myTasks.title"),
            subtitle: t("dashboard.quickActions.myTasks.subtitle"),
            implemented: false,
        },
    ];

    const handleActionClick = (action) => {
        if (!action.implemented) {
            showToast(t('comingSoon') || 'Coming Soon!');
            return;
        }

        // Handle implemented actions
        switch (action.id) {
            case 'clockIn':
                setActivePopup('clockIn');
                break;
            case 'requestLeave':
                setActivePopup('requestLeave');
                break;
            default:
                showToast(t('comingSoon') || 'Coming Soon!');
        }
    };

    const renderPopupContent = () => {
        switch (activePopup) {
            case 'clockIn':
                return (
                    <Popup
                        isOpen={activePopup === 'clockIn'}
                        onClose={closePopup}
                        title={t("dashboard.quickActions.clockIn.title")}
                        maxWidth="90vw"
                        className="sm:max-w-[800px]"
                    >
                        <ClockInPopup />
                    </Popup>
                );
            case 'requestLeave':
                return (
                    <Popup
                        isOpen={activePopup === 'requestLeave'}
                        onClose={closePopup}
                        title={t("dashboard.quickActions.requestLeave.title")}
                        maxWidth="90vw"
                        className="sm:max-w-[500px]"
                    >
                        <div className="h-[60vh] sm:h-[400px]">
                            <LeaveRequest />
                        </div>
                    </Popup>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Custom Toast */}
            <CustomToast
                message={toastMessage}
                isVisible={toastVisible}
                onClose={hideToast}
                isArabic={isArabic}
            />

            {/* Popup */}
            {renderPopupContent()}

            {/* Quick Actions Component */}
            <div
                className={`rounded-xl shadow-lg border p-3 sm:p-4  lg:p-4 xl:p-5 h-full flex flex-col ${isArabic ? "text-right" : "text-left"
                    }`}
                style={{
                    background: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                }}
                dir={isArabic ? "rtl" : "ltr"}
            >
                <h3 className="text-sm sm:text-base lg:text-sm xl:text-lg gradient-text font-semibold mb-1 sm:mb-2">
                    {t("dashboard.quickActions.title")}
                </h3>
                <p
                    className="text-xs sm:text-sm lg:text-xs xl:text-sm mb-3 sm:mb-4"
                    style={{ color: "var(--sub-text-color)" }}
                >
                    {t("dashboard.quickActions.subtitle")}
                </p>

                {/* Responsive Grid - Optimized for 1025px-1200px */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-2 xl:gap-4">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className={`flex flex-col items-center justify-center rounded-lg p-2 sm:p-3  lg:p-2 xl:p-3 shadow transition hover:shadow-md aspect-square focus:outline-none ${!action.implemented ? 'opacity-60' : 'hover:scale-105'
                                }`}
                            style={{
                                background: "var(--bg-color)",
                                minWidth: 0,
                                cursor: "pointer",
                                transform: 'scale(1)',
                                transition: 'all 0.2s ease',
                            }}
                            onClick={() => handleActionClick(action)}
                        >
                            <img
                                src={action.icon}
                                alt={action.title}
                                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8 xl:w-10 xl:h-10 mb-1 sm:mb-2"
                            />
                            <div
                                className="text-[9px] sm:text-[10px] lg:text-[9px] xl:text-xs font-semibold mb-0.5 text-center leading-tight"
                                style={{ color: "var(--text-color)" }}
                            >
                                {action.title}
                            </div>
                            <div
                                className="text-[8px] sm:text-[9px] lg:text-[8px] xl:text-[10px] text-center leading-tight hidden sm:block"
                                style={{ color: "var(--sub-text-color)" }}
                            >
                                {action.subtitle}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default QuickActions;