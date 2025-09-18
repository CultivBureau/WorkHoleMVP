import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import StatusCards from "../../../components/break-tracking/status-cards";
import BreakTime from "../../../components/break-tracking/break-time";
import BreakTypeChart from "../../../components/break-tracking/chart";
import BreakHistoryTable from "../../../components/break-tracking/table";
import { useGetBreakDashboardQuery } from "../../../services/apis/BreakApi";
import { useLang } from "../../../contexts/LangContext";

const BreakTrackingPage = () => {
  const { isRtl } = useLang();
  const { data: breakDashboard, refetch } = useGetBreakDashboardQuery();

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0" style={{ background: "var(--bg-all)" }}>
        {/* Side Menu - Left side under navbar */}
        <SideMenu />

        {/* Main Content - Optimized for 1024px-1250px range */}
        <main className="flex-1 overflow-auto p-2 sm:p-3 md:p-4 lg:p-3 xl:p-4 2xl:p-6" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-max rounded-xl lg:rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Break Tracking content with responsive padding for 1024px-1250px */}
            <div className="w-full h-max p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 2xl:p-8">
              {/* Status Cards Row - Responsive grid optimized for 1024px-1250px */}
              <div className="w-full mb-3 sm:mb-4 md:mb-5 lg:mb-4 xl:mb-6 2xl:mb-8">
                <StatusCards breakDashboard={breakDashboard} refetch={refetch} />
              </div>

              {/* Main Content Grid - Optimized for 1024px-1250px range */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-3 xl:gap-4 2xl:gap-6 mb-3 sm:mb-4 md:mb-5 lg:mb-4 xl:mb-6 2xl:mb-8">
                {/* Break Time Controls - Left Column */}
                <div className="lg:col-span-1">
                  <BreakTime breakDashboard={breakDashboard} refetch={refetch} />
                </div>
                {/* Break Type Usage Chart - Right Column */}
                <div className="lg:col-span-1">
                  <BreakTypeChart breakDashboard={breakDashboard} refetch={refetch} />
                </div>
              </div>
              
              {/* Break History Table - Full Width */}
              <div className="w-full">
                <BreakHistoryTable breakDashboard={breakDashboard} refetch={refetch} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BreakTrackingPage;