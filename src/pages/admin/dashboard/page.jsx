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

const DashboardAdmin = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);



  const navigate = useNavigate();




  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      {/* Navigation Bar */}
      <NavBarAdmin />

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SideBarAdmin />


        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6" style={{ background: "var(--bg-all)" }}>
          <div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;