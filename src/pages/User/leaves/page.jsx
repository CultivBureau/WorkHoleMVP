import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import StatusCards from "../../../components/leave-requests/status-cards";
import LeaveRequest from "../../../components/leave-requests/leave-request";
import LeaveSummaryCards from "../../../components/leave-requests/leave-summary-cards";
import LeaveTable from "../../../components/leave-requests/table";
import { useLang } from "../../../contexts/LangContext";

const Leaves = () => {
  const { isRtl } = useLang();

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
            {/* Leave Management content */}
            <div className="w-full h-max p-6">
              {/* Top Status Cards - Leave Balances */}
              <StatusCards />

              {/* Main Content Grid - Leave Request and Summary Cards Side by Side */}
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Leave Request Form - Left Column - Takes half width */}
                <div className="flex-1">
                  <LeaveRequest />
                </div>

                {/* Leave Summary Cards - Right Column - Takes half width */}
                <div className="flex-1 ">
                  <LeaveSummaryCards />
                </div>
              </div>

              {/* Leave History Table */}
              <LeaveTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaves;