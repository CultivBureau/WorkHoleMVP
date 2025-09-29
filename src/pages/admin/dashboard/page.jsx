import React, { useState ,useEffect, useCallback} from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  Coffee,
  AlertTriangle,
  Activity,
  MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useLang } from "../../../contexts/LangContext";
import Card from "../../../components/Time_Tracking_Components/Stats/Card";
import Table from "../../../components/admin/dashboard/Table/Table";
import Departments from "../../../components/admin/dashboard/Departments/Departments";
import RecentActivity from "../../../components/admin/dashboard/RecentActivity/RecentActivity";

const DashboardAdmin = () => {
  const { lang, isRtl } = useLang();
  const { t, i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Sync language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    if (i18n.language !== storedLang) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const CardData = [
    {
      title: t("adminDashboard.cards.activeEmployees", "Active Employees"),
      value: 100,
      icon: <img src="/assets/AdminDashboard/Active.svg" alt="employees" />
    },
    {
      title: t("adminDashboard.cards.todayAttendance", "Today Attendance"),
      value: 90,
      icon: <img src="/assets/AdminDashboard/today.svg" alt="employees" />
    },
    {
      title: t("adminDashboard.cards.leaveRequests", "Leave Requests"),
      value: 2,
      icon: <img src="/assets/AdminDashboard/leavee.svg" alt="employees" />
    },
    {
      title: t("adminDashboard.cards.overdueTasks", "Overdue Tasks"),
      value: 4,
      icon: <img src="/assets/AdminDashboard/task.svg" alt="employees" />
    }
  ]

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      {/* Navigation Bar */}
      <NavBarAdmin />

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SideBarAdmin />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-[var(--bg-color)] rounded-[22px]">
          {/* Stats Cards - Responsive Grid */}
          <div className="w-full h-max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5">
            {CardData.map((card, index) => (
              <Card
                key={index}
                header={card.title}
                rightIcon={card.icon}
                title={card.value}
              />
            ))}
          </div>

          {/* Main Content Section */}
          <section className="w-full h-max flex flex-col xl:flex-row justify-center items-start gap-4 lg:gap-5">
            {/* Left Section - Table and Buttons */}
            <div className="w-full xl:w-[73%] h-max flex flex-col gap-3 justify-center items-center">
              {/* Action Buttons */}
              <div className="w-full max-w-none h-auto p-4 sm:p-[29px] flex flex-col sm:flex-row flex-wrap justify-center shadow-lg border border-[var(--border-color)] rounded-[22px] items-center gap-3 sm:gap-4 lg:gap-5">
                {/* add new employee button */}
                <button className="w-full sm:w-auto sm:flex-1 sm:min-w-[150px] lg:min-w-[170px] cursor-pointer h-[40px] text-[9px] sm:text-[10px] bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                  <img src="/assets/AdminDashboard/add.svg" alt="add" className="transition-transform duration-200 group-hover:scale-110 w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">{t("adminDashboard.buttons.addNewEmployee", "Add New Employee")}</span>
                </button>
                {/* approve requests button */}
                <button className="w-full sm:w-auto sm:flex-1 sm:min-w-[150px] lg:min-w-[170px] h-[40px] text-[9px] sm:text-[10px] cursor-pointer bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                  <img src="/assets/AdminDashboard/approve.svg" alt="approve" className="transition-transform duration-200 group-hover:scale-110 w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">{t("adminDashboard.buttons.approveRequests", "Approve Requests")}</span>
                </button>
                {/* view attendance button */}
                <button className="w-full sm:w-auto sm:flex-1 sm:min-w-[150px] lg:min-w-[170px] h-[40px] text-[9px] sm:text-[10px] cursor-pointer bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                  <img src="/assets/AdminDashboard/view.svg" alt="view" className="transition-transform duration-200 group-hover:scale-110 w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">{t("adminDashboard.buttons.viewAttendance", "View Attendance")}</span>
                </button>
                {/* manage roles, permissions button */}
                <button className="w-full sm:w-auto sm:flex-1 sm:min-w-[150px] lg:min-w-[170px] h-[40px] text-[9px] sm:text-[10px] cursor-pointer bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                  <img src="/assets/AdminDashboard/manage.svg" alt="manage" className="transition-transform duration-200 group-hover:scale-110 w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate text-center">{t("adminDashboard.buttons.manageRolesPermissions", "Manage Roles, Permissions")}</span>
                </button>
              </div>
              
              {/* Table Section */}
              <div className="w-full h-max flex justify-center items-center mt-2">
                <Table />
              </div>
            </div>

            {/* Right Section - Departments and Recent Activity */}
            <div className="w-full xl:w-[27%] h-max pb-3 flex justify-center items-center flex-col gap-4">
              <Departments />
              <RecentActivity />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;