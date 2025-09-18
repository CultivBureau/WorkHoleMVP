import { useTranslation } from "react-i18next"
import { useMeQuery } from "../services/apis/AuthApi"
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Clock, 
  Calendar, 
  Shield, 
  DollarSign,
  MapPin,
  Settings,
  Camera,
  Edit3,
  ArrowLeft
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import EditProfile from "../components/profile/EditProfile";
import { useState } from "react";
import { useLang } from "../contexts/LangContext";

const Profile = () => {
    const { i18n } = useTranslation()
    const { data: user, isLoading } = useMeQuery()
    const navigate = useNavigate()
    const { lang, isRtl } = useLang()
    const [editOpen, setEditOpen] = useState(false);

    // Dynamic translations without using translation files
    const getFieldLabel = (field) => {
        const labels = {
            firstName: isRtl ? 'الاسم الأول' : 'First Name',
            lastName: isRtl ? 'الاسم الأخير' : 'Last Name',
            email: isRtl ? 'البريد الإلكتروني' : 'Email Address',
            phone: isRtl ? 'رقم الهاتف' : 'Phone Number',
            role: isRtl ? 'المنصب' : 'Position',
            shiftHours: isRtl ? 'ساعات العمل' : 'Working Hours',
            shiftStart: isRtl ? 'بداية الوردية' : 'Shift Start',
            salary: isRtl ? 'الراتب' : 'Salary',
            availableLeaves: isRtl ? 'الإجازات المتاحة' : 'Available Leaves',
            status: isRtl ? 'الحالة' : 'Status',
            locale: isRtl ? 'اللغة المفضلة' : 'Preferred Language'
        }
        return labels[field] || field
    }

    const getRoleLabel = (role) => {
        const roles = {
            employee: isRtl ? 'موظف' : 'Employee',
            manager: isRtl ? 'مدير' : 'Manager',
            admin: isRtl ? 'مدير النظام' : 'Administrator',
            hr: isRtl ? 'موارد بشرية' : 'HR Specialist'
        }
        return roles[role] || role
    }

    const getStatusLabel = (status) => {
        const statuses = {
            active: isRtl ? 'نشط' : 'Active',
            inactive: isRtl ? 'غير نشط' : 'Inactive',
            pending: isRtl ? 'في الانتظار' : 'Pending'
        }
        return statuses[status] || status
    }

    const getLanguageLabel = (locale) => {
        return locale === 'ar' ? (isRtl ? 'العربية' : 'Arabic') : (isRtl ? 'الإنجليزية' : 'English')
    }

    // Days of week for translation
    const daysOfWeek = [
        { value: "sunday", label: isRtl ? "الأحد" : "Sunday" },
        { value: "monday", label: isRtl ? "الاثنين" : "Monday" },
        { value: "tuesday", label: isRtl ? "الثلاثاء" : "Tuesday" },
        { value: "wednesday", label: isRtl ? "الأربعاء" : "Wednesday" },
        { value: "thursday", label: isRtl ? "الخميس" : "Thursday" },
        { value: "friday", label: isRtl ? "الجمعة" : "Friday" },
        { value: "saturday", label: isRtl ? "السبت" : "Saturday" },
    ];

    // Helper to render holidays as string
    const renderHolidays = (holidaysArr) => {
        if (!holidaysArr || holidaysArr.length === 0) return isRtl ? "لا يوجد" : "None";
        return holidaysArr
            .map((day) => {
                const found = daysOfWeek.find((d) => d.value === day);
                return found ? found.label : day;
            })
            .join(", ");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-color)" }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm sm:text-base" style={{ color: "var(--text-color)" }}>{isRtl ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-color)" }}>
                <div className="text-center">
                    <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" style={{ color: "var(--sub-text-color)" }} />
                    <p className="text-sm sm:text-base" style={{ color: "var(--text-color)" }}>{isRtl ? 'لا توجد بيانات مستخدم' : 'No user data found'}</p>
                </div>
            </div>
        )
    }

    return (
        <div 
            className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-6 xl:p-8" 
            style={{ backgroundColor: "var(--bg-color)", direction: isRtl ? 'rtl' : 'ltr' }}
        >
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                {/* Top Navigation - Responsive */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-color)"
                        }}
                    >
                        <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isRtl ? 'rotate-180' : ''}`} />
                        <span className="text-sm sm:text-base">{isRtl ? 'رجوع' : 'Back'}</span>
                    </button>

                    {/* Edit Profile Button - Responsive */}
                    <button
                        onClick={() => setEditOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--gradient-end)] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    >
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">{isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
                    </button>
                </div>

                {/* Profile Header Card - Fully Responsive */}
                <div 
                    className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-xl border"
                    style={{
                        backgroundColor: "var(--card-bg)",
                        borderColor: "var(--border-color)",
                        background: `linear-gradient(135deg, var(--card-bg) 0%, var(--hover-color) 100%)`
                    }}
                >
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
                        {/* Profile Image - Responsive */}
                        <div className="relative group mx-auto lg:mx-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-3 sm:border-4 border-[var(--accent-color)] shadow-2xl">
                                {user.profileImage ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextSibling.style.display = 'flex'
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-full h-full rounded-full flex items-center justify-center text-lg sm:text-2xl md:text-4xl font-bold ${user.profileImage ? 'hidden' : 'flex'}`}
                                    style={{
                                        backgroundColor: "var(--accent-color)",
                                        color: "white"
                                    }}
                                >
                                    {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                </div>
                            </div>
                            {/* Online Indicator - Responsive */}
                            {user.isActive && (
                                <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 md:bottom-2 md:right-2 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-green-500 rounded-full border-2 sm:border-3 md:border-4 border-white shadow-lg"></div>
                            )}
                            {/* Camera Icon - Responsive */}
                            <div 
                                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => setEditOpen(true)}
                            >
                                <Camera className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                            </div>
                        </div>

                        {/* User Info - Responsive */}
                        <div className="flex-1 text-center lg:text-left w-full">
                            <div className="mb-4 sm:mb-6">
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--accent-color)" }} />
                                        <span className="text-sm sm:text-base md:text-lg font-medium" style={{ color: "var(--sub-text-color)" }}>
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </div>
                                    <div 
                                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                            user.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {getStatusLabel(user.status)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base md:text-lg">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--accent-color)" }} />
                                    <span style={{ color: "var(--text-color)" }} className="break-all">{user.email}</span>
                                </div>
                            </div>

                            {/* Quick Stats - Responsive Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <div 
                                    className="p-3 sm:p-4 rounded-xl border"
                                    style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)" }}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: "var(--accent-color)" }} />
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
                                                {getFieldLabel('shiftHours')}
                                            </p>
                                            <p className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "var(--text-color)" }}>
                                                {user.shiftHours}h
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div 
                                    className="p-3 sm:p-4 rounded-xl border"
                                    style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)" }}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: "var(--accent-color)" }} />
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
                                                {getFieldLabel('availableLeaves')}
                                            </p>
                                            <p className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "var(--text-color)" }}>
                                                {user.availableLeaves} {isRtl ? 'يوم' : 'days'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div 
                                    className="p-3 sm:p-4 rounded-xl border sm:col-span-2 lg:col-span-1"
                                    style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)" }}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: "var(--accent-color)" }} />
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
                                                {getFieldLabel('shiftStart')}
                                            </p>
                                            <p className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "var(--text-color)" }}>
                                                {user.shiftStartLocal}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Information - Responsive Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Personal Information - Responsive */}
                    <div 
                        className="rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border"
                        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
                    >
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <User className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "var(--accent-color)" }} />
                            <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "var(--text-color)" }}>
                                {isRtl ? 'المعلومات الشخصية' : 'Personal Information'}
                            </h2>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <InfoField 
                                icon={User} 
                                label={getFieldLabel('firstName')} 
                                value={user.firstName} 
                            />
                            <InfoField 
                                icon={User} 
                                label={getFieldLabel('lastName')} 
                                value={user.lastName} 
                            />
                            <InfoField 
                                icon={Mail} 
                                label={getFieldLabel('email')} 
                                value={user.email} 
                            />
                            <InfoField 
                                icon={Phone} 
                                label={getFieldLabel('phone')} 
                                value={user.phone || (isRtl ? 'غير محدد' : 'Not provided')} 
                            />
                            <InfoField 
                                icon={MapPin} 
                                label={getFieldLabel('locale')} 
                                value={getLanguageLabel(user.locale)} 
                            />
                        </div>
                    </div>

                    {/* Work Information - Responsive */}
                    <div 
                        className="rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border"
                        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
                    >
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "var(--accent-color)" }} />
                            <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "var(--text-color)" }}>
                                {isRtl ? 'معلومات العمل' : 'Work Information'}
                            </h2>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <InfoField 
                                icon={Briefcase} 
                                label={getFieldLabel('role')} 
                                value={getRoleLabel(user.role)} 
                            />
                            <InfoField 
                                icon={Clock} 
                                label={getFieldLabel('shiftHours')} 
                                value={`${user.shiftHours} ${isRtl ? 'ساعات' : 'hours'}`} 
                            />
                            <InfoField 
                                icon={Clock} 
                                label={getFieldLabel('shiftStart')} 
                                value={user.shiftStartLocal} 
                            />
                            <InfoField 
                                icon={Calendar} 
                                label={getFieldLabel('availableLeaves')} 
                                value={`${user.availableLeaves} ${isRtl ? 'يوم' : 'days'}`} 
                            />
                            <InfoField 
                                icon={DollarSign} 
                                label={getFieldLabel('salary')} 
                                value={user.salary > 0 ? `$${user.salary.toLocaleString()}` : (isRtl ? 'غير محدد' : 'Not disclosed')} 
                            />
                            <InfoField 
                                icon={Shield} 
                                label={getFieldLabel('status')} 
                                value={getStatusLabel(user.status)} 
                            />
                            {/* === Holidays Field === */}
                            <InfoField
                                icon={Calendar}
                                label={isRtl ? "الإجازة الأسبوعية" : "Holidays"}
                                value={renderHolidays(user.holidays)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal - Responsive */}
            {editOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div 
                        className="w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl"
                        style={{ backgroundColor: "var(--card-bg)" }}
                    >
                        <EditProfile onClose={() => setEditOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}

// Helper Component for Info Fields - Responsive
const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 p-2 sm:p-3 rounded-xl transition-all duration-200 hover:bg-[var(--hover-color)]">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: "var(--accent-color)" }} />
        <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--sub-text-color)" }}>
                {label}
            </p>
            <p className="text-sm sm:text-base font-semibold break-words" style={{ color: "var(--text-color)" }}>
                {value}
            </p>
        </div>
    </div>
)

export default Profile