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

const LeavesAdmin = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionNote, setActionNote] = useState("");

  const { data: leavesData, isLoading, refetch } = useGetAllLeavesQuery();
  const [adminAction] = useAdminActionMutation();

  // Create stable toggle functions using useCallback
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Filter leaves data
  const filteredLeaves = leavesData?.filter(leave => {
    const matchesSearch = 
      leave.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || leave.status === filterStatus;
    const matchesType = filterType === "all" || leave.leaveType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  // Stats calculations
  const totalLeaves = leavesData?.length || 0;
  const pendingLeaves = leavesData?.filter(leave => leave.status === 'pending').length || 0;
  const approvedLeaves = leavesData?.filter(leave => leave.status === 'approved').length || 0;
  const rejectedLeaves = leavesData?.filter(leave => leave.status === 'rejected').length || 0;

  // Function to handle card clicks for filtering
  const handleCardClick = (status) => {
    if (filterStatus === status) {
      // If clicking the same card, reset to show all
      setFilterStatus("all");
    } else {
      // Set the filter to the clicked status
      setFilterStatus(status);
    }
  };

  // Function to get active card styling
  const getCardStyle = (cardStatus) => {
    const isActive = filterStatus === cardStatus;
    const isAllActive = filterStatus === "all" && cardStatus === "all";
    
    if (isActive || isAllActive) {
      return {
        backgroundColor: "var(--bg-color)",
        borderColor: "var(--accent-color)",
        borderWidth: "2px",
        transform: "scale(1.02)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      };
    }
    return {
      backgroundColor: "var(--bg-color)",
      borderColor: "var(--border-color)",
      borderWidth: "1px"
    };
  };

  const statsCards = [
    {
      title: isRtl ? "إجمالي الطلبات" : "Total Requests",
      value: totalLeaves,
      icon: FileText,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      status: "all",
      description: isRtl ? "جميع الطلبات" : "All requests"
    },
    {
      title: isRtl ? "في الانتظار" : "Pending",
      value: pendingLeaves,
      icon: Clock,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      status: "pending",
      description: isRtl ? "في انتظار المراجعة" : "Awaiting review"
    },
    {
      title: isRtl ? "موافق عليها" : "Approved",
      value: approvedLeaves,
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "#ECFDF5",
      status: "approved",
      description: isRtl ? "تمت الموافقة" : "Approved requests"
    },
    {
      title: isRtl ? "مرفوضة" : "Rejected",
      value: rejectedLeaves,
      icon: XCircle,
      color: "#EF4444",
      bgColor: "#FEF2F2",
      status: "rejected",
      description: isRtl ? "تم الرفض" : "Rejected requests"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', color: '#F59E0B' };
      case 'approved': return { bg: 'bg-green-100', text: 'text-green-800', color: '#10B981' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-800', color: '#EF4444' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', color: '#6B7280' };
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Annual Leave': return '#3B82F6';
      case 'Sick Leave': return '#EF4444';
      case 'Emergency Leave': return '#F59E0B';
      case 'Unpaid Leave': return '#6B7280';
      default: return '#8B5CF6';
    }
  };

  const handleAction = async (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setShowActionModal(true);
  };

  const submitAction = async () => {
    try {
      await adminAction({
        id: selectedLeave.id,
        data: {
          status: actionType,
          actionNote: actionNote
        }
      }).unwrap();
      
      setShowActionModal(false);
      setActionNote("");
      refetch();
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      <NavBarAdmin
        onMobileSidebarToggle={toggleMobileSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      <div className="flex flex-1 min-h-0">
        <SideBarAdmin
          lang={lang}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
        />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6" style={{ background: "var(--bg-all)" }}>
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {isRtl ? "إدارة طلبات الإجازات" : "Leave Requests Management"}
                </h1>
                <p className="text-lg mt-2" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? "مراجعة وإدارة طلبات الإجازات" : "Review and manage employee leave requests"}
                </p>
              </div>
              

            </div>

            {/* Clickable Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statsCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(card.status)}
                  className="p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95"
                  style={getCardStyle(card.status)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>
                        {card.value}
                      </p>
                      <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                        {card.description}
                      </p>
                    </div>
                    <div 
                      className="p-3 rounded-xl transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <card.icon size={24} style={{ color: card.color }} />
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {filterStatus === card.status && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-xs font-medium text-blue-600">
                        {isRtl ? "مفعل" : "Active Filter"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Enhanced Filters with Active Filter Display */}
            <div 
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              {/* Active Filter Display */}
              {filterStatus !== "all" && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {isRtl ? "فلتر نشط:" : "Active Filter:"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        filterStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        filterStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {filterStatus === 'pending' ? (isRtl ? 'في الانتظار' : 'Pending') :
                         filterStatus === 'approved' ? (isRtl ? 'موافق عليها' : 'Approved') :
                         (isRtl ? 'مرفوضة' : 'Rejected')}
                      </span>
                    </div>
                    <button
                      onClick={() => setFilterStatus("all")}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      {isRtl ? "إزالة الفلتر" : "Clear Filter"}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search 
                      size={20} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "var(--sub-text-color)" }}
                    />
                    <input
                      type="text"
                      placeholder={isRtl ? "البحث عن موظف أو نوع إجازة..." : "Search employee or leave type..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="lg:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--bg-color)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <option value="all">{isRtl ? "جميع الحالات" : "All Status"}</option>
                    <option value="pending">{isRtl ? "في الانتظار" : "Pending"}</option>
                    <option value="approved">{isRtl ? "موافق عليها" : "Approved"}</option>
                    <option value="rejected">{isRtl ? "مرفوضة" : "Rejected"}</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div className="lg:w-48">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--bg-color)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <option value="all">{isRtl ? "جميع الأنواع" : "All Types"}</option>
                    <option value="Annual Leave">{isRtl ? "إجازة سنوية" : "Annual Leave"}</option>
                    <option value="Sick Leave">{isRtl ? "إجازة مرضية" : "Sick Leave"}</option>
                    <option value="Emergency Leave">{isRtl ? "إجازة طارئة" : "Emergency Leave"}</option>
                    <option value="Unpaid Leave">{isRtl ? "إجازة بدون راتب" : "Unpaid Leave"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leaves Table */}
            <div 
              className="rounded-2xl border overflow-hidden shadow-sm"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "طلبات الإجازات" : "Leave Requests"}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "var(--sub-text-color)" }}>
                      {isRtl ? `${filteredLeaves.length} طلب` : `${filteredLeaves.length} requests`}
                      {filterStatus !== "all" && (
                        <span className="ml-2 text-blue-600">
                          {isRtl ? `(مفلترة حسب: ${filterStatus === 'pending' ? 'في الانتظار' : filterStatus === 'approved' ? 'موافق عليها' : 'مرفوضة'})` : 
                           `(filtered by: ${filterStatus === 'pending' ? 'Pending' : filterStatus === 'approved' ? 'Approved' : 'Rejected'})`}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Quick Filter Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filterStatus === "all" 
                          ? "bg-blue-100 text-blue-700 border border-blue-200" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isRtl ? "الكل" : "All"}
                    </button>
                    <button
                      onClick={() => setFilterStatus("pending")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filterStatus === "pending" 
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isRtl ? "في الانتظار" : "Pending"}
                    </button>
                    <button
                      onClick={() => setFilterStatus("approved")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filterStatus === "approved" 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isRtl ? "موافق عليها" : "Approved"}
                    </button>
                    <button
                      onClick={() => setFilterStatus("rejected")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filterStatus === "rejected" 
                          ? "bg-red-100 text-red-700 border border-red-200" 
                          : "bg-gray-200 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {isRtl ? "مرفوضة" : "Rejected"}
                    </button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--border-color)" }}>
                        <th className="text-left p-6 py-4 font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "الموظف" : "Employee"}
                        </th>
                        <th className="text-left p-6 py-4 font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "تفاصيل الإجازة" : "Leave Details"}
                        </th>
                        <th className="text-left p-6 py-4 font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "التواريخ" : "Dates"}
                        </th>
                        <th className="text-left p-6 py-4 font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "الحالة" : "Status"}
                        </th>
                        <th className="text-left p-6 py-4 font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                      {filteredLeaves.map((leave, index) => {
                        const statusStyle = getStatusColor(leave.status);
                        const typeColor = getLeaveTypeColor(leave.leaveType);
                        
                        return (
                          <tr 
                            key={index}
                            className="hover:bg-gray-50 transition-colors duration-200"
                            style={{ backgroundColor: "var(--bg-color)" }}
                          >
                            {/* Employee Column */}
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                                  {leave.user?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base" style={{ color: "var(--text-color)" }}>
                                    {leave.user}
                                  </h3>
                                  <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                    {leave.userEmail}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Leave Details Column */}
                            <td className="p-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: typeColor }}
                                  ></div>
                                  <span className="font-medium text-sm" style={{ color: "var(--text-color)" }}>
                                    {leave.leaveType}
                                  </span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    {leave.days} {isRtl ? "يوم" : "days"}
                                  </span>
                                </div>
                                
                                {leave.reason && (
                                  <div className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                    <span className="font-medium">{isRtl ? "السبب: " : "Reason: "}</span>
                                    {leave.reason}
                                  </div>
                                )}

                                <div className="flex items-center gap-4">
                                  {leave.reason && (
                                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--sub-text-color)" }}>
                                      <MessageSquare size={12} />
                                      <span>{isRtl ? "ملاحظة" : "Note"}</span>
                                    </div>
                                  )}
                                  {leave.attachmentUrl && (
                                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--sub-text-color)" }}>
                                      <Paperclip size={12} />
                                      <span>{isRtl ? "مرفق" : "Attachment"}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Dates Column */}
                            <td className="p-6">
                              <div className="space-y-1">
                                <div className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                                  {leave.startDate}
                                </div>
                                <div className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                  {isRtl ? "إلى" : "to"}
                                </div>
                                <div className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                                  {leave.endDate}
                                </div>
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="p-6">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: statusStyle.color }}
                                ></div>
                                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                  {leave.status === 'pending' ? (isRtl ? 'في الانتظار' : 'Pending') :
                                   leave.status === 'approved' ? (isRtl ? 'موافق عليه' : 'Approved') :
                                   (isRtl ? 'تم الرفض' : 'Rejected')}
                                </span>
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="p-6">
                              {leave.status === 'pending' ? (
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleAction(leave, 'approved')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600 hover:shadow-md transform hover:scale-105"
                                  >
                                    <CheckCircle size={16} />
                                    {isRtl ? "موافقة" : "Approve"}
                                  </button>
                                  <button 
                                    onClick={() => handleAction(leave, 'rejected')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-red-500 text-white hover:bg-red-600 hover:shadow-md transform hover:scale-105"
                                  >
                                    <XCircle size={16} />
                                    {isRtl ? "رفض" : "Reject"}
                                  </button>
                                </div>
                              ) : (
                                <div className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                  {leave.status === 'approved' ? 
                                    (isRtl ? 'تمت الموافقة' : 'Approved') :
                                    (isRtl ? 'تم الرفض' : 'Rejected')
                                  }
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredLeaves.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Calendar size={24} style={{ color: "var(--sub-text-color)" }} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                        {isRtl ? "لا توجد طلبات إجازة" : "No Leave Requests"}
                      </h3>
                      <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                        {isRtl ? "لا توجد طلبات تطابق المعايير المحددة" : "No requests match the selected criteria"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="w-full max-w-md p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--border-color)",
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
              {actionType === 'approved' ? 
                (isRtl ? "موافقة على الطلب" : "Approve Request") :
                (isRtl ? "رفض الطلب" : "Reject Request")
              }
            </h3>
            
            <div className="mb-4">
              <p className="text-sm mb-2" style={{ color: "var(--sub-text-color)" }}>
                {isRtl ? "الموظف:" : "Employee:"} {selectedLeave?.user}
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--sub-text-color)" }}>
                {isRtl ? "نوع الإجازة:" : "Leave Type:"} {selectedLeave?.leaveType}
              </p>
              
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                {isRtl ? "ملاحظة (اختيارية)" : "Note (Optional)"}
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={isRtl ? "أضف ملاحظة..." : "Add a note..."}
                className="w-full p-3 rounded-xl border outline-none transition-all duration-200 resize-none"
                rows={3}
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border transition-colors"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)"
                }}
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={submitAction}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  actionType === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {actionType === 'approved' ? 
                  (isRtl ? "موافقة" : "Approve") :
                  (isRtl ? "رفض" : "Reject")
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesAdmin;