import React from "react";
import { useTranslation } from "react-i18next";

const QuickActions = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const actions = [
        {
            icon: "/assets/quick_actions/clock_in.svg",
            title: t("dashboard.quickActions.clockIn.title"),
            subtitle: t("dashboard.quickActions.clockIn.subtitle"),
        },
        {
            icon: "/assets/quick_actions/leave.svg",
            title: t("dashboard.quickActions.requestLeave.title"),
            subtitle: t("dashboard.quickActions.requestLeave.subtitle"),
        },
        {
            icon: "/assets/quick_actions/task.svg",
            title: t("dashboard.quickActions.newTask.title"),
            subtitle: t("dashboard.quickActions.newTask.subtitle"),
        },
        {
            icon: "/assets/quick_actions/kpis.svg",
            title: t("dashboard.quickActions.myKpis.title"),
            subtitle: t("dashboard.quickActions.myKpis.subtitle"),
        },
        {
            icon: "/assets/quick_actions/ai.svg",
            title: t("dashboard.quickActions.askAi.title"),
            subtitle: t("dashboard.quickActions.askAi.subtitle"),
        },
        {
            icon: "/assets/quick_actions/my_tasks.svg",
            title: t("dashboard.quickActions.myTasks.title"),
            subtitle: t("dashboard.quickActions.myTasks.subtitle"),
        },
    ];

    return (
        <div
            className={`rounded-xl shadow-lg border p-5 h-full flex flex-col ${isArabic ? "text-right" : "text-left"
                }`}
            style={{
                background: "var(--bg-color)",
                borderColor: "var(--border-color)",
            }}
            dir={isArabic ? "rtl" : "ltr"}
        >
            <h3 className="text-lg gradient-text font-semibold mb-2">
                {t("dashboard.quickActions.title")}
            </h3>
            <p
                className="text-xs mb-4"
                style={{ color: "var(--sub-text-color)" }}
            >
                {t("dashboard.quickActions.subtitle")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 flex-1">
                {actions.map((action, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className="flex flex-col items-center justify-center rounded-lg p-3 shadow transition hover:shadow-md aspect-square focus:outline-none"
                        style={{
                            background: "var(--bg-color)",
                            minWidth: 0,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            // TODO: Implement navigation to the corresponding page
                            alert(
                                `Navigate to "${action.title}" page (not implemented yet)`
                            );
                        }}
                    >
                        <img
                            src={action.icon}
                            alt={action.title}
                            className="w-7 h-7 mb-2"
                        />
                        <div
                            className="text-xs font-semibold mb-0.5 text-center"
                            style={{ color: "var(--text-color)" }}
                        >
                            {action.title}
                        </div>
                        <div
                            className="text-[10px] text-center"
                            style={{ color: "var(--sub-text-color)" }}
                        >
                            {action.subtitle}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;