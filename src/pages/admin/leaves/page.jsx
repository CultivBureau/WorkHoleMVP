import React, { useState, useEffect, useCallback } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import { PermissionGuard } from "../../../components/common/PermissionGuard";
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
  Settings,
} from "lucide-react";

import { useLang } from "../../../contexts/LangContext";
import Card from "../../../components/Time_Tracking_Components/Stats/Card";
import TeamLeadLeavesTable from "../../../components/admin/leaves/LeavesTable/TeamLeadLeavesTable";
import HrLeavesTable from "../../../components/admin/leaves/LeavesTable/HrLeavesTable";
import LeaveTypesModal from "../../../components/admin/leaves/LeaveTypesModal";
import { usePermissions } from "../../../services/PermissionProvider";
import { hasBackendPermission } from "../../../utils/permissionMapping";
import { getPermissions } from "../../../utils/page";

const LeavesAdmin = () => {
  const { lang, isRtl } = useLang();
  const { t } = useTranslation();
  const permissions = usePermissions();
  const backendPermissions = getPermissions() || [];
  const [showLeaveTypesModal, setShowLeaveTypesModal] = useState(false);

  // Check if user has View permission (required to access page)
  const hasViewPermission = hasBackendPermission(backendPermissions, [
    "LeaveRequest.View",
    "LeaveRequest.ViewTeams",
    "LeaveRequest.Review",
    "LeaveRequest.Confirm",
    "LeaveRequest.Override",
  ]);

  // Check if user has Team Lead permissions (ViewTeams OR Review)
  const hasTeamLeadPermissions = hasBackendPermission(backendPermissions, [
    "LeaveRequest.ViewTeams",
    "LeaveRequest.Review",
  ]);

  // Check if user has HR permissions (Confirm)
  const hasHrPermissions = hasBackendPermission(backendPermissions, [
    "LeaveRequest.Confirm",
  ]);

  // Determine which view to show (only one table should be visible)
  // Priority: HR permissions take precedence
  const showHrView = hasHrPermissions;
  const showTeamLeadView = hasTeamLeadPermissions && !hasHrPermissions;

  const cardData = [
    {
      title: t("adminLeaves.cards.totalLeaveRequests"),
      value: 20,
      icon: <img src="/assets/AdminDashboard/total.svg" alt="employees" />
    },
    {
      title: t("adminLeaves.cards.pendingApprovals"),
      value: 12,
      icon: <img src="/assets/AdminDashboard/leavee.svg" alt="attendance" />
    },
    {
      title: t("adminLeaves.cards.approvedLeaves"),
      value: 4,
      icon: <img src="/assets/AdminDashboard/app.svg" alt="absent" />
    },
    {
      title: t("adminLeaves.cards.rejectedRequests"),
      value: 4,
      icon: <img src="/assets/AdminDashboard/task.svg" alt="late" />
    },
  ]

  return (
    <PermissionGuard 
      backendPermissions={["LeaveRequest.View", "LeaveRequest.ViewTeams", "LeaveRequest.Review", "LeaveRequest.Confirm", "LeaveRequest.Override"]}
      loadingFallback={
        <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg-all)" }}>
          <span className="text-[var(--sub-text-color)]">{t('common.loading') || 'Loading...'}</span>
        </div>
      }
    >
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

          {/* Leave Types Management Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowLeaveTypesModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Settings size={16} />
              <span>{t("adminLeaves.manageLeaveTypes", "Manage Leave Types")}</span>
            </button>
          </div>
          
          {/* Conditional rendering based on permissions - only one table should show */}
          {showHrView && (
            <div className="w-full h-max">
              <HrLeavesTable />
            </div>
          )}
          
          {showTeamLeadView && (
            <div className="w-full h-max">
              <TeamLeadLeavesTable />
            </div>
          )}

          {/* Leave Types Modal */}
          {showLeaveTypesModal && (
            <LeaveTypesModal
              isOpen={showLeaveTypesModal}
              onClose={() => setShowLeaveTypesModal(false)}
            />
          )}
        </main>
      </div>
    </div>
    </PermissionGuard>
  );
};

export default LeavesAdmin;