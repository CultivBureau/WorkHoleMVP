import React, { useState, useEffect, useCallback } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import { useLang } from "../../../contexts/LangContext";
import Card from "../../../components/Time_Tracking_Components/Stats/Card";
import DempChart from "../../../components/admin/performance/dempChart/DempChart";
import CompanyCharts from "../../../components/admin/performance/companyCharts/CompanyCharts";

const PerformanceAdmin = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();

  const cardData = [
    {
      title: "Efficiency Score",
      value: "82%",
      icon: <img src="/assets/AdminPerformance/Efficiency.svg" alt="Efficiency Score" />
    },
    {
      title: "KPI Trend vs Last Month",
      value: "12%",
      icon: <img src="/assets/AdminPerformance/kpi.svg" alt="KPI Trend vs Last Month" />
    },
    {
      title: "KPI Achievements",
      value: "4/6",
      icon: <img src="/assets/AdminPerformance/kpi2.svg" alt="KPI Achievements" />
    },
    {
      title: "Pending KPI Approvals",
      value: "4",
      icon: <img src="/assets/AdminPerformance/kpi3.svg" alt="Pending KPI Approvals" />
    },
  ]

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      <NavBarAdmin/>
      <div className="flex flex-1 min-h-0">
        <SideBarAdmin />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-3 md:p-4 lg:p-6 bg-[var(--bg-all)]">
          {/* Stats Cards - Enhanced Responsive Grid */}
          <div className="w-full h-max grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-6 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            {cardData.map((card, index) => (
              <Card
                key={index}
                header={card.title}
                rightIcon={card.icon}
                title={card.value}
              />
            ))}
          </div>

          {/* Charts Container - Responsive Spacing */}
          <div className="w-full space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <div className="w-full h-max">
              <DempChart />
            </div>

            <div className="w-full h-max">
              <CompanyCharts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PerformanceAdmin;