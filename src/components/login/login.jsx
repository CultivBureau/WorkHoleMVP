import React, { useState } from "react";
import { useLoginMutation } from "../../services/apis/AuthApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import LogoIcon from "../../assets/side-menu-icons/logo.svg";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Globe,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isRtl = i18n.language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      toast.success(t('login.loginSuccess'));

      // Redirect based on user role
      if (res.user?.role === "admin") {
        navigate("/pages/admin/dashboard");
      } else {
        navigate("/pages/User/dashboard");
      }

      // Auto refresh the app after successful login
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (err) {
      toast.error(err?.data?.message || t('login.loginFailed'));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - hidden on mobile */}
      <div className="hidden md:flex flex-1 bg-white items-center justify-center relative overflow-hidden">
        <img
          src="/assets/back.png"
          alt="Login dashboard mockup"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Panel */}
      <div className={`flex-1 bg-white border-l border-gray-200 md:rounded-l-3xl shadow-2xl shadow-gray-500 flex items-center justify-center relative overflow-y-auto`}>
        {/* Language Toggle */}
        <div className={`absolute top-3 sm:top-4 md:top-6 ${isRtl ? "left-3 sm:left-4 md:left-6" : "right-3 sm:right-4 md:right-6"} z-10`}>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md sm:rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </span>
          </button>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
          {/* Logo and Title */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
              <img src={LogoIcon} alt="WorkHole" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                <span className="font-bold gradient-text">Work</span>
                <span style={{ color: "var(--text-color)" }}>Hole</span>
              </h1>
            </div>
            <img
              src="/assets/Login.png"
              alt="Login Illustration"
              className="mx-auto mb-3 sm:mb-4 md:mb-6 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Email Field */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="email"
                className={`text-gray-600 block text-xs sm:text-sm md:text-base ${isRtl ? "text-right" : "text-left"}`}
              >
                {t('login.emailAddress')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('login.enterEmail')}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${isRtl ? "text-right" : "text-left"}`}
                dir={isRtl ? "rtl" : "ltr"}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1 sm:space-y-2">
              <div className="relative">
                <label
                  htmlFor="password"
                  className={`text-gray-600 block text-xs sm:text-sm md:text-base ${isRtl ? "text-right" : "text-left"}`}
                >
                  {t('login.password')}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={t('login.enterPassword')}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 md:pr-12 border border-gray-200 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${isRtl ? "text-right" : "text-left"}`}
                  dir={isRtl ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? "left-2 sm:left-3" : "right-2 sm:right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                >
                  {showPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={`flex items-center justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">{t('login.rememberMe')}</span>
              </label>
              <Link
                to="/forget-password"
                className="text-xs sm:text-sm gradient-text font-semibold hover:text-teal-600 hover:underline"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-bg text-white py-2 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin" />
                  <span className="text-xs sm:text-sm">{t('login.signingIn')}</span>
                </div>
              ) : (
                t('login.signIn')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
