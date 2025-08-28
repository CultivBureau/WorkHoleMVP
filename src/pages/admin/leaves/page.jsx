import React, { useState, useEffect } from "react";
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

const LeavesAdmin = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  const { data: leavesData, isLoading, refetch } = useGetAllLeavesQuery();
  const [adminAction] = useAdminActionMutation();

  const isRtl = lang === "ar";

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

  const statsCards = [
    {
      title: isRtl ? "إجمالي الطلبات" : "Total Requests",
      value: totalLeaves,
      icon: FileText,
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    },
    {
      title: isRtl ? "في الانتظار" : "Pending",
      value: pendingLeaves,
      icon: Clock,
      color: "#F59E0B",
      bgColor: "#FFFBEB"
    },
    {
      title: isRtl ? "موافق عليها" : "Approved",
      value: approvedLeaves,
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    {
      title: isRtl ? "مرفوضة" : "Rejected",
      value: rejectedLeaves,
      icon: XCircle,
      color: "#EF4444",
      bgColor: "#FEF2F2"
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
    <div 
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar */}
      <NavBarAdmin 
        lang={lang} 
        setLang={setLang}
        onMobileSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SideBarAdmin 
          lang={lang}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
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
              
              <div className="flex items-center gap-3">
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)"
                  }}
                >
                  <Download size={16} />
                  {isRtl ? "تصدير" : "Export"}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm mb-2" style={{ color: "var(--sub-text-color)" }}>
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>
                        {card.value}
                      </p>
                    </div>
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <card.icon size={24} style={{ color: card.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div 
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
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
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "طلبات الإجازات" : "Leave Requests"}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? `${filteredLeaves.length} طلب` : `${filteredLeaves.length} requests`}
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredLeaves.map((leave, index) => {
                    const statusStyle = getStatusColor(leave.status);
                    const typeColor = getLeaveTypeColor(leave.leaveType);
                    
                    return (
                      <div 
                        key={index}
                        className="p-6 border-b hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <div className="flex items-center justify-between">
                          {/* Employee Info */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {leave.user?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold" style={{ color: "var(--text-color)" }}>
                                {leave.user}
                              </h3>
                              <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                {leave.userEmail}
                              </p>
                            </div>
                          </div>

                          {/* Leave Details */}
                          <div className="flex-1 mx-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar size={16} style={{ color: typeColor }} />
                                  <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                                    {leave.leaveType}
                                  </span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                                  {leave.days} {isRtl ? "يوم" : "days"}
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <CalendarDays size={16} style={{ color: "var(--sub-text-color)" }} />
                                  <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                                    {isRtl ? "التاريخ" : "Date"}
                                  </span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                                  {leave.startDate} - {leave.endDate}
                                </p>
                              </div>

                              <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                  {leave.status === 'pending' ? (isRtl ? 'في الانتظار' : 'Pending') :
                                   leave.status === 'approved' ? (isRtl ? 'موافق عليه' : 'Approved') :
                                   (isRtl ? 'مرفوض' : 'Rejected')}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                {leave.reason && (
                                  <div className="p-1 rounded" style={{ backgroundColor: "#F3F4F6" }}>
                                    <MessageSquare size={12} style={{ color: "var(--sub-text-color)" }} />
                                  </div>
                                )}
                                {leave.attachmentUrl && (
                                  <div className="p-1 rounded" style={{ backgroundColor: "#F3F4F6" }}>
                                   <Paperclip size={12} style={{ color: "var(--sub-text-color)" }} />

                                  </div>
                                )}
                              </div>
                            </div>

                            {leave.reason && (
                              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "var(--hover-color)" }}>
                                <p className="text-sm" style={{ color: "var(--text-color)" }}>
                                  <span className="font-medium">{isRtl ? "السبب: " : "Reason: "}</span>
                                  {leave.reason}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {leave.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleAction(leave, 'approved')}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-100 text-green-800 hover:bg-green-200"
                                >
                                  <CheckCircle size={16} />
                                  {isRtl ? "موافقة" : "Approve"}
                                </button>
                                <button 
                                  onClick={() => handleAction(leave, 'rejected')}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-red-100 text-red-800 hover:bg-red-200"
                                >
                                  <XCircle size={16} />
                                  {isRtl ? "رفض" : "Reject"}
                                </button>
                              </>
                            )}
                            <button 
                              className="p-2 rounded-lg transition-colors"
                              style={{
                                backgroundColor: "var(--hover-color)",
                                color: "var(--text-color)"
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="p-2 rounded-lg transition-colors"
                              style={{
                                backgroundColor: "var(--hover-color)",
                                color: "var(--text-color)"
                              }}
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredLeaves.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar size={48} className="mx-auto mb-4" style={{ color: "var(--sub-text-color)" }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                        {isRtl ? "لا توجد طلبات إجازة" : "No Leave Requests"}
                      </h3>
                      <p style={{ color: "var(--sub-text-color)" }}>
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