import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import ActivityHeatmap from "../../../components/dashboard/activity-heatmap";
import StatusCards from "../../../components/dashboard/status-cards";
import QuickActions from "../../../components/dashboard/quick-actions";
import BreakTime from "../../../components/dashboard/break-time";
import LeaveRequest from "../../../components/leave-requests/leave-request";
import { useGetDashboardQuery } from "../../../services/apis/DashboardApi";
import { useLang } from "../../../contexts/LangContext";

const Dashboard = () => {
  const { lang, isRtl } = useLang();

  // جلب بيانات الداشبورد من الـ API مع refetch
  const { data: dashboardData, isLoading, error, refetch } = useGetDashboardQuery();

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0" style={{ background: "var(--bg-all)" }}>
        {/* Side Menu - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <SideMenu />
        </div>

        {/* Main Content - Full width on mobile, adjusted on desktop */}
        <main className="flex-1 overflow-auto p-2 sm:p-3 lg:p-4" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-max rounded-xl lg:rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Dashboard content with responsive padding */}
            <div className="w-full h-max p-3 sm:p-4 lg:p-6">
              {/* Status Cards - Always full width and responsive */}
              <div className="w-full">
                <StatusCards dashboardData={dashboardData} isLoading={isLoading} error={error} refetch={refetch} />
              </div>

              {/* Quick Actions & Break Time - Stack on mobile, side by side on tablet+ */}
              <div className="mt-4 sm:mt-5 lg:mt-6 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
                <div className="flex-1 min-w-0">
                  <QuickActions dashboardData={dashboardData} isLoading={isLoading} error={error} refetch={refetch} />
                </div>
                <div className="flex-1 min-w-0">
                  <BreakTime dashboardData={dashboardData} isLoading={isLoading} error={error} refetch={refetch} />
                </div>
              </div>

              {/* Activity Heatmap - Full width and responsive */}
              <div className="mt-4 sm:mt-5 lg:mt-6">
                <ActivityHeatmap dashboardData={dashboardData} isLoading={isLoading} error={error} refetch={refetch} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;