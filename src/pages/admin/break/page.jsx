import React, { useState, useEffect } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import {
  Coffee,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { useGetBreakTypesQuery } from "../../../services/apis/BreakApi";
import BreakTypeModal from "../../../components/admin/BreakTypeModal";

const BreakAdmin = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("types");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editBreakType, setEditBreakType] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  const { data: breakTypes, isLoading, refetch } = useGetBreakTypesQuery();
  const isRtl = lang === "ar";

  const tabs = [
    { key: "types", label: isRtl ? "أنواع الراحة" : "Break Types", icon: Coffee },
    { key: "history", label: isRtl ? "السجل" : "History", icon: Clock }
  ];

  const breakTypeStats = {
    totalTypes: breakTypes?.length || 0,
    avgDuration: 15
  };

  const statsCards = [
    {
      title: isRtl ? "أنواع الراحة" : "Break Types",
      value: breakTypeStats.totalTypes,
      icon: Coffee,
      color: "#8B5CF6",
      bgColor: "#F3E8FF"
    },
    {
      title: isRtl ? "متوسط المدة" : "Avg Duration",
      value: `${breakTypeStats.avgDuration}${isRtl ? ' د' : 'm'}`,
      icon: Clock,
      color: "#10B981",
      bgColor: "#ECFDF5"
    }
  ];

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      <NavBarAdmin 
        lang={lang} 
        setLang={setLang}
        onMobileSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      <div className="flex flex-1 min-h-0">
        <SideBarAdmin 
          lang={lang}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto p-6" style={{ background: "var(--bg-all)" }}>
          <div className="max-w-7xl mx-auto space-y-6">
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
                  onClick={() => {
                    setEditBreakType(null);
                    setShowCreateModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium gradient-bg"
                >
                  <Plus size={16} />
                  {isRtl ? "إضافة نوع راحة" : "Add Break Type"}
                </button>
              </div>
            </div>
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
            <div className="rounded-2xl border" style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)" }}>
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
                </div>
                {selectedTab === 'types' ? (
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
                                  onClick={() => {
                                    setEditBreakType({
                                      id: breakType._id,
                                      name: breakType.name,
                                      duration: breakType.duration,
                                      isActive: breakType.isActive
                                    });
                                    setShowCreateModal(true);
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
                ) : (
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
            <BreakTypeModal
              show={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              initialData={editBreakType}
              isRtl={isRtl}
              onSuccess={() => {
                refetch();
                setShowCreateModal(false);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BreakAdmin;
