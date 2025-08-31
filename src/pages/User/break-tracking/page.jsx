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

        {/* Main Content - Rest of the space */}
        <main className="flex-1 overflow-auto p-4" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-max rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Break Tracking content */}
            <div className="w-full h-max p-6">
              {/* Status Cards Row */}
              <StatusCards breakDashboard={breakDashboard} refetch={refetch} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
              <div className="mb-6">
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