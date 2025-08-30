"use client"
import { useTranslation } from "react-i18next";
import Card from "../Time_Tracking_Components/Stats/Card";
import { ChartColumn, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StatusCards({ dashboardData, isLoading, error }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Use API response fields with proper fallbacks
  const status = dashboardData?.currentStatus || t("dashboard.statusCards.notClockedIn");
  const leaveStatus = dashboardData?.leaveStatus || t("dashboard.statusCards.pending");
  const dailyShift = dashboardData?.dailyShift || "0h 0m";
  const performance = dashboardData?.performance || t("dashboard.statusCards.comingSoon");

  // SVGs as <img> tags with responsive sizing
  const CalendarIcon = (
    <img src="/assets/dashboard_card/status.svg" alt="calendar" className="w-4 h-4 sm:w-5 sm:h-5" />
  );
  const LeaveIcon = (
    <img src="/assets/dashboard_card/clock2.svg" alt="leave" className="w-4 h-4 sm:w-5 sm:h-5" />
  );
  const ClockIcon = (
    <img src="/assets/dashboard_card/clock.svg" alt="clock" className="w-4 h-4 sm:w-5 sm:h-5" />
  );
  const PerformanceIcon = (
    <img src="/assets/dashboard_card/performance.svg" alt="performance" className="w-4 h-4 sm:w-5 sm:h-5" />
  );
  const BarChartIcon = (
    <button
      className="p-1.5 sm:p-2 rounded-lg transition-colors duration-200 hover:opacity-80"
      style={{
        backgroundColor: 'var(--hover-color)',
        color: 'var(--accent-color)'
      }}
    >
      <ChartColumn size={12} className="sm:w-4 sm:h-4 gradient-color" strokeWidth={2.5} />
    </button>
  );

  const GoToTimeTrackerBtn = (
    <button
      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-white font-medium text-xs shadow-sm hover:shadow-md transition-all duration-200 gradient-bg"
      onClick={() => navigate("/pages/User/time_tracking")}
    >
      <Clock size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
      <span className="hidden sm:inline">{t("dashboard.statusCards.goToTimeTracker")}</span>
      <span className="sm:hidden">Track</span>
    </button>
  );

  const shiftHours = dashboardData?.shiftHours || 8;
  const dailyShiftHours = dashboardData?.dailyShiftHours || 0;
  const dailyShiftBar = Math.min(Math.round((dailyShiftHours / shiftHours) * 100), 100);

  // Dynamic daily shift calculation
  const [dynamicShift, setDynamicShift] = useState(dashboardData?.dailyShift || "0h 0m");

  useEffect(() => {
    let interval;
    if (
      dashboardData?.currentStatus === "Clocked In" &&
      dashboardData?.clockIn
    ) {
      const updateShift = () => {
        const now = new Date();
        const [h, m] = dashboardData.clockIn.split(":").map(Number);
        const clockInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
        let diff = Math.floor((now - clockInDate) / 60000);
        if (diff < 0) diff = 0;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        setDynamicShift(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
      };
      updateShift();
      interval = setInterval(updateShift, 60000);
    } else {
      setDynamicShift(dashboardData?.dailyShift || "0h 0m");
    }
    return () => clearInterval(interval);
  }, [dashboardData]);

  if (isLoading) {
    return <div className="w-full flex justify-center items-center py-4 sm:py-8">Loading...</div>;
  }
  if (error) {
    return <div className="w-full flex justify-center items-center py-4 sm:py-8 text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="w-full">
      {/* Mobile: Column layout, Desktop: Row layout */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-6 min-h-[120px] sm:h-[22vh]">
        <Card
          header={t("dashboard.statusCards.status")}
          title={status}
          subTitle={t("dashboard.statusCards.goToTimeTracker")}
          statusDot={
            <span
              className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ml-1 sm:ml-2 ${status === t("dashboard.statusCards.notClockedIn") || status === "Not clocked in"
                  ? "bg-red-500"
                  : "bg-green-500"
                }`}
            ></span>
          }
          rightIcon={CalendarIcon}
          button={GoToTimeTrackerBtn}
          className="h-full min-h-[120px]"
        />
        <Card
          header={t("dashboard.statusCards.leaveRequest")}
          title={leaveStatus}
          subTitle={t("dashboard.statusCards.noRequestText")}
          rightIcon={LeaveIcon}
          footer={BarChartIcon}
          className="h-full min-h-[120px]"
        />
        <Card
          header={t("dashboard.statusCards.dailyShift")}
          title={
            <span className="transition-all duration-300 text-sm sm:text-base">
              {dynamicShift}
            </span>
          }
          subTitle={t("dashboard.statusCards.hoursWorked")}
          rightIcon={ClockIcon}
          bar={dailyShiftBar}
          footer={BarChartIcon}
          className="h-full min-h-[120px]"
        />
        <Card
          header={t("dashboard.statusCards.performance")}
          title={performance}
          subTitle={t("dashboard.statusCards.tasksCompleted")}
          rightIcon={PerformanceIcon}
          bar={dashboardData?.performanceBar || 75}
          footer={BarChartIcon}
          className="h-full min-h-[120px]"
        />
      </div>
    </div>
  );
}
