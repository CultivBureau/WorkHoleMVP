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
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);



  const navigate = useNavigate();

 const CardData = [
  {
    title: "Active Employees",
    value: 100,
    icon: <img src="/assets/AdminDashboard/Active.svg" alt="employees" />
  },
  {
    title: "Today Attendance",
    value: 90,
    icon: <img src="/assets/AdminDashboard/today.svg" alt="employees" />
  },
  {
    title: "Leave Requests",
    value: 2,
    icon: <img src="/assets/AdminDashboard/leavee.svg" alt="employees" />
  },
  {
    title: "Overdue Tasks",
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
        <main className="flex-1 overflow-auto p-6 bg-[var(--bg-color)] rounded-[22px]">
          <div className="w-full h-max flex justify-center items-center gap-4 ">
            {CardData.map((card, index) => (
                                    <Card
                                    key={index}
                                    header={card.title}
                                    rightIcon={card.icon}
                                    title={card.value}
                                />
            ))}
          </div>
          <section className="w-full h-max flex justify-center items-center mt-5">
                  <div className="w-[73%] h-max flex flex-col gap-3 justify-center items-center ">
                    {/* buttons */}
                         <div className="w-[96%] h-[84px] p-[29px]  flex justify-center shadow-lg border border-[var(--border-color)] rounded-[22px] items-center gap-5">
                               {/* add new employee button */}
                               <button className="w-[23%] min-w-[170px] cursor-pointer h-[40px] text-[10px] bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                                 <img src="/assets/AdminDashboard/add.svg" alt="add" className="transition-transform duration-200 group-hover:scale-110" />
                                    {isRtl ? "إضافة موظف جديد" : "Add New Employee"}
                               </button>
                               {/* approve requests button */}
                               <button className="w-[23%] min-w-[170px] h-[40px] text-[10px] cursor-pointer bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                                 <img src="/assets/AdminDashboard/approve.svg" alt="approve" className="transition-transform duration-200 group-hover:scale-110" />
                                    {isRtl ? "موافقة على الطلبات" : "Approve Requests"}
                               </button>
                                  {/* view attendance button */}
                                  <button className="w-[23%] min-w-[170px] h-[40px] text-[10px] cursor-pointer bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                                    <img src="/assets/AdminDashboard/view.svg" alt="view" className="transition-transform duration-200 group-hover:scale-110" />
                                        {isRtl ? "مشاهدة الحضور" : "View Attendance"}
                                  </button>
                                  {/* manage roles, permissions button */}
                                  <button className="w-[24%] min-w-[170px] h-[40px] text-[10px] cursor-pointer bg-[var(--bg-color)] border border-[var(--border-color)] font-semibold gradient-text flex justify-center items-center gap-2 text-white rounded-md transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] active:scale-[0.98] active:shadow-sm">
                                    <img src="/assets/AdminDashboard/manage.svg" alt="manage" className="transition-transform duration-200 group-hover:scale-110" />
                                        {isRtl ? "إدارة الأدوار والصلاحيات" : "Manage Roles, Permissions"}
                                  </button>
                         </div>
                         <div className="w-full h-max flex justify-center items-center mt-2">
                          <Table />
                         </div>
                  </div>
                  <div className="w-[27%] h-max pb-3 flex justify-center items-center flex-col ">
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