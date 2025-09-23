import React, { useState, useEffect, useCallback } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import { useLang } from "../../../contexts/LangContext";
import Card from "../../../components/Time_Tracking_Components/Stats/Card";
import Table from "../../../components/admin/TeamWallet/Table/Table";

const AdminTeamWallet = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();

  const cardData = [
    {
      title: "Total Penalties",
      value: "$12000",
      icon: <img src="/assets/AdminTeamWallet/money.svg" alt="Efficiency Score" />
    },
    {
      title: "Teams with Warnings",
      value: "4 Teams",
      icon: <img src="/assets/AdminTeamWallet/warning.svg" alt="KPI Trend vs Last Month" />
    },
    {
      title: "Highest Penalty Team",
      value: "$6800",
      icon: <img src="/assets/AdminTeamWallet/team.svg" alt="KPI Achievements" />
    },
    {
      title: "Resolved Issues",
      value: "10",
      icon: <img src="/assets/AdminTeamWallet/issue.svg" alt="Pending KPI Approvals" />
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

          <section className="w-full h-[470px] bg-red-500"></section>
          <div className="w-full h-max">
            <Table />
          </div>


        </main>
      </div>
    </div>
  );
};

export default AdminTeamWallet;