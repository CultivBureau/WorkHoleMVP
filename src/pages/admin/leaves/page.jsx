import React, { useState, useEffect, useCallback } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  AlertTriangle,
  User,
  CalendarDays,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { 
  useGetAllLeavesQuery,
  useAdminActionMutation 
} from "../../../services/apis/LeavesApi";
import { useLang } from "../../../contexts/LangContext";
import Card from "../../../components/Time_Tracking_Components/Stats/Card";
import Table from "../../../components/admin/leaves/LeavesTable/Table";

const LeavesAdmin = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();


const cardData = [
  {
    title: "Total Leave Requests",
    value: 20,
      icon: <img src="/assets/AdminDashboard/total.svg" alt="employees" />
    },
    {
      title: "Pending Approvals",
      value: 12,
      icon: <img src="/assets/AdminDashboard/leavee.svg" alt="attendance" />
    },
    {
      title: "Approved Leaves",
      value: 4,
      icon: <img src="/assets/AdminDashboard/app.svg" alt="absent" />
    },
    {
      title: "Rejected Requests",
      value: 4,
      icon: <img src="/assets/AdminDashboard/task.svg" alt="late" />
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
            <Table />
          </div>
        </main>
      </div>


    </div>
  );
};

export default LeavesAdmin;