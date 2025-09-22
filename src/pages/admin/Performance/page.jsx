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
        <main className="flex-1 overflow-auto p-6 bg-[var(--bg-all)]">
                  {/* Stats Cards - Responsive Grid */}
          <div className="w-full h-max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5">
            {cardData.map((card, index) => (
              <Card
                key={index}
                header={card.title}
                rightIcon={card.icon}
                title={card.value}
              />
            ))}
          </div>

         <div className="w-full h-max">
           <DempChart />
         </div>

         <div className="w-full h-max">
              <CompanyCharts />
         </div>

        </main>
      </div>


    </div>
  );
};

export default PerformanceAdmin;