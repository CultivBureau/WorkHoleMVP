
import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import StatusCards from "../../../components/leave-requests/status-cards";
import LeaveRequest from "../../../components/leave-requests/leave-request";
import LeaveSummaryCards from "../../../components/leave-requests/leave-summary-cards";
import LeaveTable from "../../../components/leave-requests/table";
import Loading from "../../../components/Loading/Loading";
import { useGetLeaveStatsQuery } from "../../../services/apis/LeavesApi";
import { useLang } from "../../../contexts/LangContext";

const Leaves = () => {
  const { isRtl } = useLang();
  
  // Check loading state from the main API query used by components
  const { isLoading } = useGetLeaveStatsQuery();

  // Show loading screen while data is being fetched
  if (isLoading) {
    return <Loading />;
  }

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

        {/* Main Content - Responsive padding for 1024px-1300px */}
        <main className="flex-1 overflow-auto p-2 sm:p-3 md:p-4 lg:p-3 xl:p-4 2xl:p-6" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-max rounded-xl lg:rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Leave Management content with responsive padding */}
            <div className="w-full h-max p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 2xl:p-8">
              {/* Top Status Cards - Leave Balances */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-4 xl:mb-5 2xl:mb-6">
                <StatusCards />
              </div>

              {/* Main Content Grid - Responsive for 1024px-1300px */}
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-3 xl:gap-4 2xl:gap-6 mb-4 sm:mb-5 md:mb-6 lg:mb-4 xl:mb-5 2xl:mb-6">
                {/* Leave Request Form - Left Column - Takes half width */}
                <div className="flex-1">
                  <LeaveRequest />
                </div>

                {/* Leave Summary Cards - Right Column - Takes half width */}
                <div className="flex-1">
                  <LeaveSummaryCards />
                </div>
              </div>

              {/* Leave History Table */}
              <div className="w-full">
                <LeaveTable />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaves;