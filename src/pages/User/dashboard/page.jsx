import React, { useState, useEffect } from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import ActivityHeatmap from "../../../components/dashboard/activity-heatmap";
import StatusCards from "../../../components/dashboard/status-cards";
import QuickActions from "../../../components/dashboard/quick-actions";
import BreakTime from "../../../components/dashboard/break-time";
import { useTranslation } from "react-i18next";
import { useGetDashboardQuery } from "../../../services/apis/DashboardApi";

const Dashboard = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  // جلب بيانات الداشبورد من الـ API
  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar lang={lang} setLang={setLang} />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0" style={{ background: "var(--bg-all)" }}>
        {/* Side Menu - Left side under navbar */}
        <SideMenu lang={lang} />

        {/* Main Content - Rest of the space */}
        <main className="flex-1 overflow-auto p-4" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-max rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Dashboard content */}
            <div className="w-full h-max p-6">
              {/* Status Cards */}
              <StatusCards dashboardData={dashboardData} isLoading={isLoading} error={error} />

              {/* Quick Actions & Break Time */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <QuickActions dashboardData={dashboardData} isLoading={isLoading} error={error} />
                </div>
                <div className="flex-1 min-w-0">
                  <BreakTime dashboardData={dashboardData} isLoading={isLoading} error={error} />
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="mt-6">
                <ActivityHeatmap dashboardData={dashboardData} isLoading={isLoading} error={error} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
