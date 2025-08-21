"use client"
import { useTranslation } from "react-i18next";
import Card from "../Time_Tracking_Components/Stats/Card";
import { ChartColumn, Clock } from "lucide-react";
export default function StatusCards() {
  const { t } = useTranslation();

  // SVGs as <img> tags
  const CalendarIcon = (
    <img src="/assets/dashboard_card/status.svg" alt="calendar" className="w-5 h-5" />
  );
  const LeaveIcon = (
    <img src="/assets/dashboard_card/clock2.svg" alt="leave" className="w-5 h-5" />
  );
  const ClockIcon = (
    <img src="/assets/dashboard_card/clock.svg" alt="clock" className="w-5 h-5" />
  );
  const PerformanceIcon = (
    <img src="/assets/dashboard_card/performance.svg" alt="performance" className="w-5 h-5" />
  );
  const BarChartIcon = (
    <button
      className="p-2 rounded-lg transition-colors duration-200 hover:opacity-80"
      style={{
        backgroundColor: 'var(--hover-color)',
        color: 'var(--accent-color)'
      }}
    >
      <ChartColumn size={15} strokeWidth={2.5} className="gradient-color" />
    </button>
  );

  // Red status dot using error color
  const RedDot = (
    <span
      className="inline-block w-2 h-2 rounded-full ml-2"
      style={{ backgroundColor: 'var(--error-color)' }}
    ></span>
  );

  // Gradient button using Tailwind and gradient-bg utility
  const GoToTimeTrackerBtn = (
    <button
      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-white font-medium text-xs shadow-sm hover:shadow-md transition-all duration-200 gradient-bg"
    >
      <Clock size={16} strokeWidth={2.5} className="text-white" />
      {t("dashboard.statusCards.goToTimeTracker")}
    </button>
  );

  return (
    <div className="w-full h-[22vh] flex justify-center items-stretch gap-6">
      {/* Status Card */}
      <Card
        header={t("dashboard.statusCards.status")}
        title={t("dashboard.statusCards.notClockedIn")}
        subTitle={t("dashboard.statusCards.goToTimeTracker")}
        statusDot={<span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-2"></span>}
        rightIcon={CalendarIcon}
        button={GoToTimeTrackerBtn}
        className="h-full"
      />

      {/* Leave Request Card */}
      <Card
        header={t("dashboard.statusCards.leaveRequest")}
        title={t("dashboard.statusCards.noLeaveRequest")}
        subTitle={t("dashboard.statusCards.noRequestText")}
        rightIcon={LeaveIcon}
        footer={BarChartIcon}
        className="h-full"
      />

      {/* Daily Shift Card */}
      <Card
        header={t("dashboard.statusCards.dailyShift")}
        title={`2:15:00`}
        subTitle={t("dashboard.statusCards.hoursWorked")}
        rightIcon={ClockIcon}
        bar={45}
        footer={BarChartIcon}
        className="h-full"
      />

      {/* Performance Card */}
      <Card
        header={t("dashboard.statusCards.performance")}
        title="75%"
        subTitle={t("dashboard.statusCards.tasksCompleted")}
        rightIcon={PerformanceIcon}
        bar={75}
        footer={BarChartIcon}
        className="h-full"
      />
    </div>
  );
}
