import React, { useState, useEffect } from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import StatusCards from "../../../components/leave-requests/status-cards";
import LeaveRequest from "../../../components/leave-requests/leave-request";
import LeaveSummaryCards from "../../../components/leave-requests/leave-summary-cards";
import LeaveTable from "../../../components/leave-requests/table";
import { useTranslation } from "react-i18next";

const Leaves = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", i18n.language);
  }, [i18n.language]);

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar lang={currentLang} setLang={setCurrentLang} />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0" style={{ background: "var(--bg-all)" }}>
        {/* Side Menu - Left side under navbar */}
        <SideMenu lang={currentLang} />

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

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Leave Request Form - Left Column (2/3 width) */}
                <div className="xl:col-span-2">
                  <LeaveRequest />
                </div>
                
                {/* Leave Summary Cards - Right Column (1/3 width) */}
                <div className="xl:col-span-1">
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
