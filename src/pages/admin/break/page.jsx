import React, { useState, useEffect } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import {
  Coffee,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Play,
  Pause,
  StopCircle,
  Timer,
} from "lucide-react";
import { useGetBreakTypesQuery } from "../../../services/apis/BreakApi";

const BreakAdmin = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("types");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  const { data: breakTypes, isLoading } = useGetBreakTypesQuery();

  const isRtl = lang === "ar";

  // Mock data for active breaks
  const activeBreaks = [
    {
      id: 1,
      user: { firstName: "John", lastName: "Doe", email: "john@company.com", avatar: "JD" },
      breakType: "Lunch",
      startTime: "12:30 PM",
      duration: 25,
      expectedDuration: 30,
      status: "active",
      location: "office"
    },
    {
      id: 2,
      user: { firstName: "Sarah", lastName: "Smith", email: "sarah@company.com", avatar: "SS" },
      breakType: "Coffee Break",
      startTime: "3:15 PM", 
      duration: 18,
      expectedDuration: 15,
      status: "exceeded",
      location: "remote"
    },
    {
      id: 3,
      user: { firstName: "Ahmed", lastName: "Ali", email: "ahmed@company.com", avatar: "AA" },
      breakType: "Personal",
      startTime: "2:00 PM",
      duration: 8,
      expectedDuration: 10,
      status: "active",
      location: "office"
    }
  ];

  const tabs = [
    { key: "types", label: isRtl ? "أنواع الراحة" : "Break Types", icon: Coffee },
    { key: "active", label: isRtl ? "فترات الراحة النشطة" : "Active Breaks", icon: Activity },
    { key: "history", label: isRtl ? "السجل" : "History", icon: Clock }
  ];

  const breakTypeStats = {
    totalTypes: breakTypes?.length || 0,
    activeBreaks: activeBreaks.length,
    exceededBreaks: activeBreaks.filter(b => b.status === 'exceeded').length,
    avgDuration: 15
  };

  const getBreakStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: 'bg-blue-100', text: 'text-blue-800', color: '#3B82F6' };
      case 'exceeded': return { bg: 'bg-red-100', text: 'text-red-800', color: '#EF4444' };
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-800', color: '#10B981' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', color: '#6B7280' };
    }
  };

  const getProgressPercentage = (current, expected) => {
    return Math.min((current / expected) * 100, 100);
  };

  const filteredActiveBreaks = activeBreaks.filter(brk => 
    (brk.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     brk.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     brk.breakType.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === "all" || brk.status === filterType)
  );

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
                  {isRtl ? "إدارة فترات الراحة" : "Break Management"}
                </h1>
                <p className="text-lg mt-2" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? "إدارة أنواع الراحة ومراقبة النشاط الحالي" : "Manage break types and monitor current activity"}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium gradient-bg"
                >
                  <Plus size={16} />
                  {isRtl ? "إضافة نوع راحة" : "Add Break Type"}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                {
                  title: isRtl ? "أنواع الراحة" : "Break Types",
                  value: breakTypeStats.totalTypes,
                  icon: Coffee,
                  color: "#8B5CF6",
                  bgColor: "#F3E8FF"
                },
                {
                  title: isRtl ? "فترات نشطة" : "Active Breaks",
                  value: breakTypeStats.activeBreaks,
                  icon: Activity,
                  color: "#3B82F6",
                  bgColor: "#EFF6FF"
                },
                {
                  title: isRtl ? "تجاوز الوقت" : "Exceeded Time",
                  value: breakTypeStats.exceededBreaks,
                  icon: AlertTriangle,
                  color: "#EF4444",
                  bgColor: "#FEF2F2"
                },
                {
                  title: isRtl ? "متوسط المدة" : "Avg Duration",
                  value: `${breakTypeStats.avgDuration}${isRtl ? ' د' : 'm'}`,
                  icon: Clock,
                  color: "#10B981",
                  bgColor: "#ECFDF5"
                }
              ].map((card, index) => (
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

            {/* Tabs */}
            <div 
              className="rounded-2xl border"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex border-b" style={{ borderColor: "var(--border-color)" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      selectedTab === tab.key ? 'border-b-2' : ''
                    }`}
                    style={{
                      color: selectedTab === tab.key ? "var(--accent-color)" : "var(--sub-text-color)",
                      borderColor: selectedTab === tab.key ? "var(--accent-color)" : "transparent"
                    }}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search 
                        size={20} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "var(--sub-text-color)" }}
                      />
                      <input
                        type="text"
                        placeholder={selectedTab === 'types' ? 
                          (isRtl ? "البحث عن نوع راحة..." : "Search break types...") :
                          (isRtl ? "البحث عن موظف..." : "Search employee...")
                        }
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

                  {selectedTab === 'active' && (
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
                        <option value="all">{isRtl ? "جميع الحالات" : "All Status"}</option>
                        <option value="active">{isRtl ? "نشط" : "Active"}</option>
                        <option value="exceeded">{isRtl ? "تجاوز الوقت" : "Exceeded"}</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Content based on selected tab */}
                {selectedTab === 'types' ? (
                  // Break Types Grid
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {breakTypes?.map((breakType, index) => (
                          <div
                            key={index}
                            className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg"
                            style={{
                              backgroundColor: "var(--hover-color)",
                              borderColor: "var(--border-color)",
                            }}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="p-2 rounded-lg"
                                  style={{ backgroundColor: "#8B5CF620" }}
                                >
                                  <Coffee size={20} style={{ color: "#8B5CF6" }} />
                                </div>
                                <div>
                                  <h3 className="font-semibold" style={{ color: "var(--text-color)" }}>
                                    {breakType.name}
                                  </h3>
                                  <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                    {breakType.duration} {isRtl ? "دقيقة" : "minutes"}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 rounded-lg transition-colors hover:bg-blue-50"
                                  style={{
                                    backgroundColor: "var(--bg-color)",
                                    color: "var(--text-color)"
                                  }}
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  className="p-2 rounded-lg transition-colors hover:bg-red-50"
                                  style={{
                                    backgroundColor: "var(--bg-color)",
                                    color: "var(--text-color)"
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span style={{ color: "var(--sub-text-color)" }}>
                                  {isRtl ? "النشاط:" : "Status:"}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  breakType.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {breakType.isActive ? 
                                    (isRtl ? "نشط" : "Active") : 
                                    (isRtl ? "غير نشط" : "Inactive")
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span style={{ color: "var(--sub-text-color)" }}>
                                  {isRtl ? "الاستخدام اليومي:" : "Daily Usage:"}
                                </span>
                                <span style={{ color: "var(--text-color)" }}>
                                  {Math.floor(Math.random() * 10) + 1} {isRtl ? "مرة" : "times"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span style={{ color: "var(--sub-text-color)" }}>
                                  {isRtl ? "متوسط الاستخدام:" : "Avg Usage:"}
                                </span>
                                <span style={{ color: "var(--text-color)" }}>
                                  {Math.floor(Math.random() * 5) + 10} {isRtl ? "د" : "min"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedTab === 'active' ? (
                  // Active Breaks Table
                  <div className="space-y-4">
                    {filteredActiveBreaks.map((breakItem, index) => {
                      const statusStyle = getBreakStatusColor(breakItem.status);
                      const progress = getProgressPercentage(breakItem.duration, breakItem.expectedDuration);
                      
                      return (
                        <div
                          key={index}
                          className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg"
                          style={{
                            backgroundColor: "var(--hover-color)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            {/* User Info */}
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {breakItem.user.avatar}
                              </div>
                              <div>
                                <h3 className="font-semibold" style={{ color: "var(--text-color)" }}>
                                  {breakItem.user.firstName} {breakItem.user.lastName}
                                </h3>
                                <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                  {breakItem.user.email}
                                </p>
                              </div>
                            </div>

                            {/* Break Info */}
                            <div className="flex-1 mx-6">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Coffee size={16} style={{ color: "#8B5CF6" }} />
                                  <span className="font-medium" style={{ color: "var(--text-color)" }}>
                                    {breakItem.breakType}
                                  </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                  {breakItem.status === 'active' ? (isRtl ? 'نشط' : 'Active') :
                                   breakItem.status === 'exceeded' ? (isRtl ? 'تجاوز الوقت' : 'Exceeded') :
                                   (isRtl ? 'مكتمل' : 'Completed')}
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div className="mb-2">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span style={{ color: "var(--sub-text-color)" }}>
                                    {breakItem.duration} / {breakItem.expectedDuration} {isRtl ? "دقيقة" : "minutes"}
                                  </span>
                                  <span style={{ color: "var(--sub-text-color)" }}>
                                    {isRtl ? `بدأ في ${breakItem.startTime}` : `Started at ${breakItem.startTime}`}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      breakItem.status === 'exceeded' ? 'bg-red-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button 
                                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                                style={{
                                  backgroundColor: breakItem.status === 'exceeded' ? "#FEF2F2" : "#EFF6FF",
                                  color: breakItem.status === 'exceeded' ? "#EF4444" : "#3B82F6"
                                }}
                              >
                                {breakItem.status === 'exceeded' ? (
                                  <>
                                    <AlertTriangle size={16} />
                                    {isRtl ? "تنبيه" : "Alert"}
                                  </>
                                ) : (
                                  <>
                                    <Timer size={16} />
                                    {isRtl ? "جاري" : "Active"}
                                  </>
                                )}
                              </button>
                              <button 
                                className="p-2 rounded-lg transition-colors"
                                style={{
                                  backgroundColor: "var(--bg-color)",
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

                    {filteredActiveBreaks.length === 0 && (
                      <div className="text-center py-12">
                        <Coffee size={48} className="mx-auto mb-4" style={{ color: "var(--sub-text-color)" }} />
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "لا توجد فترات راحة نشطة" : "No Active Breaks"}
                        </h3>
                        <p style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "جميع الموظفين يعملون حالياً" : "All employees are currently working"}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // History Tab
                  <div className="text-center py-12">
                    <Clock size={48} className="mx-auto mb-4" style={{ color: "var(--sub-text-color)" }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "سجل فترات الراحة" : "Break History"}
                    </h3>
                    <p style={{ color: "var(--sub-text-color)" }}>
                      {isRtl ? "قريباً..." : "Coming soon..."}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default BreakAdmin;
