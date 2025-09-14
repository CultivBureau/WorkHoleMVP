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
    <div
      className="min-h-screen h-[100vh] flex"
    >
      {/* Left Panel */}
      <div className="flex-1 bg-white flex items-center justify-center relative overflow-hidden">
        <img
          src="public/assets/upscalemedia-transformed.png"
          alt="Login dashboard mockup"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Panel */}
      <div className={`flex-1 bg-white border-l border-gray-200 rounded-l-3xl shadow-2xl shadow-gray-500 flex items-center justify-center relative`}>
        {/* Language Toggle */}
        <div className={`absolute top-6 ${isRtl ? "left-6" : "right-6"}`}>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </span>
          </button>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={LogoIcon} alt="WorkHole" className="w-12 h-12" />
              <h1 className="text-3xl">
                <span className="font-bold gradient-text">Work</span>
                <span style={{ color: "var(--text-color)" }}>Hole</span>
              </h1>
            </div>
            <img
              src="public/assets/Login.png"
              alt="Login Illustration"
              className="mx-auto mb-6 w-68 h-68 object-contain"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className={`text-gray-600 block ${isRtl ? "text-right" : "text-left"}`}
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
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${isRtl ? "text-right" : "text-left"}`}
                dir={isRtl ? "rtl" : "ltr"}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="password"
                  className={`text-gray-600 block ${isRtl ? "text-right" : "text-left"}`}
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
                  className={`w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${isRtl ? "text-right" : "text-left"}`}
                  dir={isRtl ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-600">{t('login.rememberMe')}</span>
              </label>
              <Link
                to="/forget-password"
                className="text-sm gradient-text font-semibold hover:text-teal-600 hover:underline"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-bg text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('login.signingIn')}
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
