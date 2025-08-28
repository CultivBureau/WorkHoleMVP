import React, { useState, useEffect } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  MoreVertical,
  UserPlus,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../../services/apis/UsersApi";

const UsersAdmin = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
    shiftHours: 8,
    shiftStartLocal: "09:00",
    locale: "en",
    isActive: true,
    salary: 0,
    phone: "",
    status: "active",
    availableLeaves: 21,
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  const { data: usersData = [], isLoading, refetch } = useGetAllUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const isRtl = lang === "ar";

  // Filter users
  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats calculations
  const totalUsers = usersData.length;
  const adminUsers = usersData.filter((user) => user.role === "admin").length;
  const employeeUsers = usersData.filter((user) => user.role === "employee").length;
  const activeUsers = usersData.filter((user) => user.status === "active").length;

  const statsCards = [
    {
      title: isRtl ? "إجمالي المستخدمين" : "Total Users",
      value: totalUsers,
      icon: Users,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
    },
    {
      title: isRtl ? "المديرون" : "Admins",
      value: adminUsers,
      icon: Shield,
      color: "#8B5CF6",
      bgColor: "#F3E8FF",
    },
    {
      title: isRtl ? "الموظفون" : "Employees",
      value: employeeUsers,
      icon: User,
      color: "#10B981",
      bgColor: "#ECFDF5",
    },
    {
      title: isRtl ? "المستخدمون النشطون" : "Active Users",
      value: activeUsers,
      icon: CheckCircle,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "employee",
      shiftHours: 8,
      shiftStartLocal: "09:00",
      locale: "en",
      isActive: true,
      salary: 0,
      phone: "",
      status: "active",
      availableLeaves: 21,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData).unwrap();
      setShowCreateModal(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "", // Don't prefill password
      role: user.role || "employee",
      shiftHours: user.shiftHours || 8,
      shiftStartLocal: user.shiftStartLocal || "09:00",
      locale: user.locale || "en",
      isActive: user.isActive !== undefined ? user.isActive : true,
      salary: user.salary || 0,
      phone: user.phone || "",
      status: user.status || "active",
      availableLeaves: user.availableLeaves || 21,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't update password if empty
      }
      await updateUser({ id: selectedUser._id, ...updateData }).unwrap();
      setShowEditModal(false);
      resetForm();
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm(isRtl ? "هل تريد حذف هذا المستخدم؟" : "Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        refetch();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const getRoleColor = (role) => {
    return role === "admin" ? "#8B5CF6" : "#10B981";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return { bg: "bg-green-100", text: "text-green-800", color: "#10B981" };
      case "suspended":
        return { bg: "bg-red-100", text: "text-red-800", color: "#EF4444" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", color: "#6B7280" };
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
                  {isRtl ? "إدارة المستخدمين" : "User Management"}
                </h1>
                <p className="text-lg mt-2" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? "إضافة وإدارة حسابات المستخدمين" : "Add and manage user accounts"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium gradient-bg"
                >
                  <UserPlus size={16} />
                  {isRtl ? "إضافة مستخدم" : "Add User"}
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
                      placeholder={isRtl ? "البحث عن مستخدم..." : "Search users..."}
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

                {/* Role Filter */}
                <div className="lg:w-48">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--bg-color)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <option value="all">{isRtl ? "جميع الأدوار" : "All Roles"}</option>
                    <option value="admin">{isRtl ? "مدير" : "Admin"}</option>
                    <option value="employee">{isRtl ? "موظف" : "Employee"}</option>
                  </select>
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
                    <option value="active">{isRtl ? "نشط" : "Active"}</option>
                    <option value="suspended">{isRtl ? "معلق" : "Suspended"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "قائمة المستخدمين" : "Users List"}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? `${filteredUsers.length} مستخدم` : `${filteredUsers.length} users`}
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: "var(--accent-color)" }}
                  ></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "var(--hover-color)" }}>
                      <tr>
                        <th
                          className="text-left py-4 px-6 font-semibold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {isRtl ? "المستخدم" : "User"}
                        </th>
                        <th
                          className="text-left py-4 px-6 font-semibold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {isRtl ? "الدور" : "Role"}
                        </th>
                        <th
                          className="text-left py-4 px-6 font-semibold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {isRtl ? "الهاتف" : "Phone"}
                        </th>
                        <th
                          className="text-left py-4 px-6 font-semibold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {isRtl ? "ساعات العمل" : "Work Hours"}
                        </th>
                        <th
                          className="text-left py-4 px-6 font-semibold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {isRtl ? "الحالة" : "Status"}
                        </th>
                        <th
                          className="text-left py-4 px-6 font-semibold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {isRtl ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => {
                        const statusStyle = getStatusColor(user.status);

                        return (
                          <tr
                            key={index}
                            className="border-b hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "var(--border-color)" }}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium" style={{ color: "var(--text-color)" }}>
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {user.role === "admin" ? (
                                  <Shield size={16} style={{ color: getRoleColor(user.role) }} />
                                ) : (
                                  <User size={16} style={{ color: getRoleColor(user.role) }} />
                                )}
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: getRoleColor(user.role) }}
                                >
                                  {user.role === "admin"
                                    ? isRtl
                                      ? "مدير"
                                      : "Admin"
                                    : isRtl
                                    ? "موظف"
                                    : "Employee"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span style={{ color: "var(--text-color)" }}>
                                {user.phone || "N/A"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span style={{ color: "var(--text-color)" }}>
                                {user.shiftHours || 8}{isRtl ? " ساعة" : "h"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                              >
                                {user.status === "active"
                                  ? isRtl
                                    ? "نشط"
                                    : "Active"
                                  : isRtl
                                  ? "معلق"
                                  : "Suspended"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="p-2 rounded-lg transition-colors hover:bg-blue-50"
                                  style={{
                                    backgroundColor: "var(--hover-color)",
                                    color: "var(--text-color)",
                                  }}
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="p-2 rounded-lg transition-colors hover:bg-red-50"
                                  style={{
                                    backgroundColor: "var(--hover-color)",
                                    color: "var(--text-color)",
                                  }}
                                  disabled={deleting}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12">
                            <Users
                              size={48}
                              className="mx-auto mb-4"
                              style={{ color: "var(--sub-text-color)" }}
                            />
                            <h3
                              className="text-lg font-semibold mb-2"
                              style={{ color: "var(--text-color)" }}
                            >
                              {isRtl ? "لا توجد مستخدمين" : "No Users Found"}
                            </h3>
                            <p style={{ color: "var(--sub-text-color)" }}>
                              {isRtl
                                ? "لا توجد مستخدمين تطابق المعايير المحددة"
                                : "No users match the selected criteria"}
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                {isRtl ? "إضافة مستخدم جديد" : "Add New User"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "var(--sub-text-color)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "المعلومات الأساسية" : "Basic Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الاسم الأول" : "First Name"} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "اسم العائلة" : "Last Name"} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "البريد الإلكتروني" : "Email"} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "كلمة المرور" : "Password"} *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الهاتف" : "Phone"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الدور" : "Role"} *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <option value="employee">{isRtl ? "موظف" : "Employee"}</option>
                      <option value="admin">{isRtl ? "مدير" : "Admin"}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "معلومات العمل" : "Work Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "ساعات العمل" : "Work Hours"} *
                    </label>
                    <input
                      type="number"
                      name="shiftHours"
                      value={formData.shiftHours}
                      onChange={handleInputChange}
                      required
                      min={1}
                      max={12}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "وقت بداية العمل" : "Work Start Time"}
                    </label>
                    <input
                      type="time"
                      name="shiftStartLocal"
                      value={formData.shiftStartLocal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الراتب" : "Salary"}
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      min={0}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "إجازات متاحة" : "Available Leaves"}
                    </label>
                    <input
                      type="number"
                      name="availableLeaves"
                      value={formData.availableLeaves}
                      onChange={handleInputChange}
                      min={0}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "الإعدادات" : "Settings"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "اللغة" : "Language"}
                    </label>
                    <select
                      name="locale"
                      value={formData.locale}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الحالة" : "Status"}
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <option value="active">{isRtl ? "نشط" : "Active"}</option>
                      <option value="suspended">{isRtl ? "معلق" : "Suspended"}</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-2"
                      style={{ accentColor: "var(--accent-color)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "المستخدم نشط" : "User is active"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-3 rounded-lg text-white font-medium gradient-bg flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {creating ? (isRtl ? "جاري الإنشاء..." : "Creating...") : (isRtl ? "إنشاء" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                {isRtl ? "تعديل المستخدم" : "Edit User"}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedUser(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "var(--sub-text-color)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              {/* Same form structure as create modal, but for editing */}
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "المعلومات الأساسية" : "Basic Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الاسم الأول" : "First Name"} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "اسم العائلة" : "Last Name"} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "البريد الإلكتروني" : "Email"} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "كلمة المرور الجديدة" : "New Password"} {isRtl ? "(اختيارية)" : "(Optional)"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength={6}
                      placeholder={isRtl ? "اتركها فارغة للاحتفاظ بالقديمة" : "Leave empty to keep current"}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الهاتف" : "Phone"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الدور" : "Role"} *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <option value="employee">{isRtl ? "موظف" : "Employee"}</option>
                      <option value="admin">{isRtl ? "مدير" : "Admin"}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "معلومات العمل" : "Work Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "ساعات العمل" : "Work Hours"} *
                    </label>
                    <input
                      type="number"
                      name="shiftHours"
                      value={formData.shiftHours}
                      onChange={handleInputChange}
                      required
                      min={1}
                      max={12}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "وقت بداية العمل" : "Work Start Time"}
                    </label>
                    <input
                      type="time"
                      name="shiftStartLocal"
                      value={formData.shiftStartLocal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الراتب" : "Salary"}
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      min={0}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "إجازات متاحة" : "Available Leaves"}
                    </label>
                    <input
                      type="number"
                      name="availableLeaves"
                      value={formData.availableLeaves}
                      onChange={handleInputChange}
                      min={0}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "الإعدادات" : "Settings"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "اللغة" : "Language"}
                    </label>
                    <select
                      name="locale"
                      value={formData.locale}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "الحالة" : "Status"}
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <option value="active">{isRtl ? "نشط" : "Active"}</option>
                      <option value="suspended">{isRtl ? "معلق" : "Suspended"}</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-2"
                      style={{ accentColor: "var(--accent-color)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "المستخدم نشط" : "User is active"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-3 rounded-lg text-white font-medium gradient-bg flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {updating ? (isRtl ? "جاري التحديث..." : "Updating...") : (isRtl ? "تحديث" : "Update")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
