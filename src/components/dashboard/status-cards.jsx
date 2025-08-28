"use client"
import { useTranslation } from "react-i18next";
import Card from "../Time_Tracking_Components/Stats/Card";
import { ChartColumn, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StatusCards({ dashboardData, isLoading, error }) {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Add this

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
      onClick={() => navigate("/pages/User/time_tracking")} // Add navigation
    >
      <Clock size={16} strokeWidth={2.5} className="text-white" />
      {t("dashboard.statusCards.goToTimeTracker")}
    </button>
  );

  const shiftHours = dashboardData?.shiftHours || 8; // إجمالي ساعات الشيفت
  const dailyShiftHours = dashboardData?.dailyShiftHours || 0; // ساعات العمل الفعلية اليوم
  const dailyShiftBar = Math.min(Math.round((dailyShiftHours / shiftHours) * 100), 100); // النسبة %

  // Dynamic daily shift calculation
  const [dynamicShift, setDynamicShift] = useState(dashboardData?.dailyShift || "0h 0m");

  useEffect(() => {
    let interval;
    if (
      dashboardData?.currentStatus === "Clocked In" &&
      dashboardData?.clockIn // لازم يكون عندك clockIn في الـ API
    ) {
      const updateShift = () => {
        const now = new Date();
        // clockIn لازم يكون بصيغة "HH:mm"
        const [h, m] = dashboardData.clockIn.split(":").map(Number);
        const clockInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
        let diff = Math.floor((now - clockInDate) / 60000); // فرق بالدقايق
        if (diff < 0) diff = 0;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        setDynamicShift(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
      };
      updateShift();
      interval = setInterval(updateShift, 60000); // يحدث كل دقيقة
    } else {
      setDynamicShift(dashboardData?.dailyShift || "0h 0m");
    }
    return () => clearInterval(interval);
  }, [dashboardData]);

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
        statusDot={
          <span
            className={`inline-block w-2 h-2 rounded-full ml-2 ${
              status === t("dashboard.statusCards.notClockedIn") || status === "Not clocked in"
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          ></span>
        }
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
        title={
          <span className="transition-all duration-300">
            {dynamicShift}
          </span>
        }
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
