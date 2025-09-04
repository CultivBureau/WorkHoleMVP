"use client"
import { useTranslation } from "react-i18next";
import Card from "../Time_Tracking_Components/Stats/Card";
import { ChartColumn, Clock, TrendingUp, Activity } from "lucide-react";
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

  // Enhanced SVGs with better styling
  const CalendarIcon = (
    <div className="w-full h-full flex items-center justify-center">
      <img src="/assets/dashboard_card/status.svg" alt="calendar" className="w-6 h-6 transition-transform duration-200 hover:scale-110"/>
    </div>
  );
  
  const LeaveIcon = (
    <div className="w-full h-full flex items-center justify-center">
      <img src="/assets/dashboard_card/clock2.svg" alt="leave" className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
    </div>
  );
  
  const ClockIcon = (
    <div className="w-full h-full flex items-center justify-center">
      <img src="/assets/dashboard_card/clock.svg" alt="clock" className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
    </div>
  );
  
  const PerformanceIcon = (
    <div className="w-full h-full flex items-center justify-center">
      <img src="/assets/dashboard_card/performance.svg" alt="performance" className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
    </div>
  );

  // Enhanced chart icon with better styling
  const BarChartIcon = (
    <ChartColumn size={16} className="transition-all duration-200" strokeWidth={2.5} />
  );

  // Enhanced button with better animations
  const GoToTimeTrackerBtn = (
    <button
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 transform active:scale-95"
      style={{
        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
      }}
      onClick={() => navigate("/pages/User/time_tracking")}
    >
      <Clock size={16} strokeWidth={2.5} />
      <span>{t("dashboard.statusCards.goToTimeTracker")}</span>
    </button>
  );

  const shiftHours = dashboardData?.shiftHours || 8;
  const dailyShiftHours = dashboardData?.dailyShiftHours || 0;
  const dailyShiftBar = Math.min(Math.round((dailyShiftHours / shiftHours) * 100), 100);

  // Dynamic daily shift calculation with enhanced animation
  const [dynamicShift, setDynamicShift] = useState(dashboardData?.dailyShift || "0h 0m");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let interval;
    if (
      dashboardData?.currentStatus === "Clocked In" &&
      dashboardData?.clockIn
    ) {
      setIsLive(true);
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
      setIsLive(false);
      setDynamicShift(dashboardData?.dailyShift || "0h 0m");
    }
    return () => clearInterval(interval);
  }, [dashboardData]);

  // Enhanced loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-6 min-h-[120px] sm:h-[22vh]">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-full min-h-[140px] p-4 rounded-2xl border animate-pulse"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
              </div>
              <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-500 font-medium">Error loading dashboard data</p>
          <p className="text-sm text-gray-500 mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Enhanced grid with better responsive design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card
          header={t("dashboard.statusCards.status")}
          title={
            <div className="flex items-center gap-2">
              <span>{status}</span>
              {isLive && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs  text-green-500 font-medium">Live</span>
                </div>
              )}
            </div>
          }
          statusDot={
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                // Dynamic status based on clock state
                status === t("dashboard.statusCards.notClockedIn") || status === "Not clocked in"
                  ? "bg-red-500 shadow-lg" // Red when not clocked in
                  : status === "Clocked In" || status === t("dashboard.statusCards.clockedIn")
                  ? "bg-green-500 shadow-lg animate-pulse" // Green pulsing when clocked in
                  : status === "Clocked Out" || status === t("dashboard.statusCards.clockedOut")
                  ? "bg-gray-400 shadow-lg" // Gray when finished (clocked out)
                  : "bg-yellow-500 shadow-lg" // Yellow for any other status
              }`}
              style={{ 
                boxShadow: status === t("dashboard.statusCards.notClockedIn") || status === "Not clocked in"
                  ? '0 0 10px rgba(239, 68, 68, 0.4)' // Red glow
                  : status === "Clocked In" || status === t("dashboard.statusCards.clockedIn")
                  ? '0 0 10px rgba(34, 197, 94, 0.4)' // Green glow
                  : status === "Clocked Out" || status === t("dashboard.statusCards.clockedOut")
                  ? '0 0 10px rgba(156, 163, 175, 0.4)' // Gray glow
                  : '0 0 10px rgba(234, 179, 8, 0.4)' // Yellow glow
              }}
            ></span>
          }
          rightIcon={CalendarIcon}
          button={GoToTimeTrackerBtn}
          className="h-full min-h-[160px]"
        />
        
        <Card
          header={t("dashboard.statusCards.leaveRequest")}
          title={leaveStatus}
          rightIcon={LeaveIcon}
          footer={BarChartIcon}
          className="h-full min-h-[160px]"
        />
        
        <Card
          header={t("dashboard.statusCards.dailyShift")}
          title={
            <span className="transition-all duration-300 flex items-center gap-2">
              {dynamicShift}
              {isLive && <TrendingUp size={16} className="text-green-500 animate-pulse" />}
            </span>
          }
          rightIcon={ClockIcon}
          bar={dailyShiftBar}
          percentage={dailyShiftBar}
          footer={BarChartIcon}
          className="h-full min-h-[160px]"
        />
        
        <Card
          header={t("dashboard.statusCards.performance")}
          title={performance}
          rightIcon={PerformanceIcon}
          bar={dashboardData?.performanceBar || 75}
          percentage={dashboardData?.performanceBar || 75}
          footer={BarChartIcon}
          className="h-full min-h-[160px]"
        />
      </div>
    </div>
  );
}
