import React, { useState, useCallback } from "react";
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
  X,
  AlertTriangle,
} from "lucide-react";
import { 
  useGetBreakTypesQuery,
  useDeleteBreakTypeMutation 
} from "../../../services/apis/BreakApi";
import BreakTypeModal from "../../../components/admin/BreakTypeModal";
import { useLang } from "../../../contexts/LangContext";

const BreakAdmin = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Create stable toggle functions using useCallback
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("types");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editBreakType, setEditBreakType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [breakToDelete, setBreakToDelete] = useState(null);

  const { data: breakTypes, isLoading, refetch } = useGetBreakTypesQuery();
  const [deleteBreakType, { isLoading: deleting }] = useDeleteBreakTypeMutation();

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

  const handleDeleteClick = (breakType) => {
    setBreakToDelete(breakType);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBreakType(breakToDelete._id).unwrap();
      setShowDeleteModal(false);
      setBreakToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting break type:", error);
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
                      className="p-3 rounded-xl gradient-bg"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <card.icon size={24} className="text-white" />
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
                                  onClick={() => handleDeleteClick(breakType)}
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
            {/* Delete Confirmation Modal */}
            {showDeleteModal && breakToDelete && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-lg bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div 
                  className="w-full max-w-md transform transition-all duration-300 scale-100"
                  style={{ direction: isRtl ? "rtl" : "ltr" }}
                >
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2 size={32} className="text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {isRtl ? "تأكيد الحذف" : "Confirm Deletion"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isRtl ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-6">
                      <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                        <div className="text-center">
                          <p className="text-gray-800 mb-2">
                            {isRtl ? "هل أنت متأكد من أنك تريد حذف نوع الراحة هذا؟" : "Are you sure you want to delete this break type?"}
                          </p>
                          <div className="flex items-center justify-center gap-3 mt-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                              <Coffee size={20} className="text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {breakToDelete.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {breakToDelete.duration} {isRtl ? "دقيقة" : "minutes"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                          <span>
                            {isRtl ? "ستفقد جميع بيانات نوع الراحة نهائياً" : "All break type data will be permanently lost"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                          <span>
                            {isRtl ? "لن يتمكن الموظفون من استخدام هذا النوع" : "Employees will no longer be able to use this break type"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setShowDeleteModal(false);
                            setBreakToDelete(null);
                          }}
                          className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                          disabled={deleting}
                        >
                          {isRtl ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                          onClick={handleDeleteConfirm}
                          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                            deleting
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 transform active:scale-95"
                          }`}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              {isRtl ? "جاري الحذف..." : "Deleting..."}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Trash2 size={18} />
                              {isRtl ? "حذف نوع الراحة" : "Delete Break Type"}
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BreakAdmin;
