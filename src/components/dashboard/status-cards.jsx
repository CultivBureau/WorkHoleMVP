"use client"
import { useTranslation } from "react-i18next";
import Card from "../Time_Tracking_Components/Stats/Card";
import { ChartColumn, Clock } from "lucide-react";

export default function StatusCards({ dashboardData, isLoading, error }) {
  const { t } = useTranslation();

  // Use API response fields
  const status = dashboardData?.currentStatus || t("dashboard.statusCards.notClockedIn");
  const leaveRequest = dashboardData?.leaveStatus || t("dashboard.statusCards.noLeaveRequest");
  const dailyShift = dashboardData?.dailyShift || "0h 0m";
  const performance = dashboardData?.performance || "coming soon"; // If you have performance in API

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

  const GoToTimeTrackerBtn = (
    <button
      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-white font-medium text-xs shadow-sm hover:shadow-md transition-all duration-200 gradient-bg"
    >
      <Clock size={16} strokeWidth={2.5} className="text-white" />
      {t("dashboard.statusCards.goToTimeTracker")}
    </button>
  );

  const shiftHours = dashboardData?.shiftHours || 8; // إجمالي ساعات الشيفت
  const dailyShiftHours = dashboardData?.dailyShiftHours || 0; // ساعات العمل الفعلية اليوم
  const dailyShiftBar = Math.min(Math.round((dailyShiftHours / shiftHours) * 100), 100); // النسبة %

  if (isLoading) {
    return <div className="w-full flex justify-center items-center py-8">Loading...</div>;
  }
  if (error) {
    return <div className="w-full flex justify-center items-center py-8 text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="w-full h-[22vh] flex justify-center items-stretch gap-6">
      <Card
        header={t("dashboard.statusCards.status")}
        title={status}
        subTitle={t("dashboard.statusCards.goToTimeTracker")}
        statusDot={<span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-2"></span>}
        rightIcon={CalendarIcon}
        button={GoToTimeTrackerBtn}
        className="h-full"
      />
      <Card
        header={t("dashboard.statusCards.leaveRequest")}
        title={leaveRequest}
        subTitle={t("dashboard.statusCards.noRequestText")}
        rightIcon={LeaveIcon}
        footer={BarChartIcon}
        className="h-full"
      />
      <Card
        header={t("dashboard.statusCards.dailyShift")}
        title={dailyShift}
        subTitle={t("dashboard.statusCards.hoursWorked")}
        rightIcon={ClockIcon}
        bar={dailyShiftBar}
        footer={BarChartIcon}
        className="h-full"
      />
      <Card
        header={t("dashboard.statusCards.performance")}
        title={performance}
        subTitle={t("dashboard.statusCards.tasksCompleted")}
        rightIcon={PerformanceIcon}
        bar={dashboardData?.performanceBar || 75}
        footer={BarChartIcon}
        className="h-full"
      />
    </div>
  );
}
