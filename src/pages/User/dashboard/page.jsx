import React, { useState } from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import ActivityHeatmap from "../../../components/dashboard/activity-heatmap";
import StatusCards from "../../../components/dashboard/status-cards";
import QuickActions from "../../../components/dashboard/quick-actions";
import BreakTime from "../../../components/dashboard/break-time";
import { useLang } from "../../../contexts/LangContext";

// Static dashboard data
const staticDashboardData = {
  currentStatus: "Clocked In",
  todayAttendance: {
    clockIn: "09:00 AM",
    clockOut: null,
    workedHours: "4h 30m",
    status: "Present"
  },
  weeklyStats: {
    workedDays: 5,
    totalHours: "42h 15m",
    averageHours: "8h 27m"
  },
  monthlyStats: {
    present: 22,
    absent: 1,
    late: 2,
    earlyLeave: 1
  },
  activityHeatmap: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2024, new Date().getMonth(), i + 1).toISOString().split('T')[0],
    value: Math.floor(Math.random() * 8) + 1
  })),
  quickActions: [
    { id: 1, name: "Clock In", icon: "clock_in" },
    { id: 2, name: "My Tasks", icon: "task" },
    { id: 3, name: "Leave Request", icon: "leave" },
    { id: 4, name: "KPIs", icon: "kpis" }
  ]
};

const Dashboard = () => {
  const { lang, isRtl } = useLang();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Use static data instead of API call
  const dashboardData = staticDashboardData;
  const isLoading = false;
  const error = null;
  const refetch = () => {}; // Empty function for compatibility

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0" style={{ background: "var(--bg-all)" }}>
        {/* Side Menu - Always rendered */}
        <SideMenu />

        {/* Main Content - Responsive padding and layout */}
        <main className="flex-1 overflow-auto p-2 sm:p-3 md:p-4 lg:p-4 xl:p-5 2xl:p-6" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-max rounded-xl lg:rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Dashboard content with responsive padding */}
            <div className="w-full h-max p-3 sm:p-4 md:p-5 lg:p-5 xl:p-6 2xl:p-8">
              {/* Status Cards - Responsive grid */}
              <div className="w-full mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-8">
                <StatusCards dashboardData={dashboardData} isLoading={isLoading} error={error} refetch={refetch} />
              </div>

              {/* Quick Actions & Break Time - Responsive layout for 1025px-1200px */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-4 xl:gap-6">
                <div className="w-full">
                  <QuickActions dashboardData={dashboardData} isLoading={isLoading} error={error} refetch={refetch} />
                </div>
                <div className="w-full">
                  <BreakTime dashboardData={dashboardData} isLoading={isLoading} error={error} refetch={refetch} />
                </div>
              </div>

              {/* Activity Heatmap - Full width and responsive */}
              <div className="w-full">
                <ActivityHeatmap 
                  dashboardData={dashboardData} 
                  isLoading={isLoading} 
                  error={error} 
                  refetch={refetch}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
