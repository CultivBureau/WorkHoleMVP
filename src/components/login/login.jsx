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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        background: "var(--bg-color)",
        direction: isRtl ? 'rtl' : 'ltr'
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating shapes */}
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-pulse"
            style={{ background: "linear-gradient(135deg, #09D1C7, #15919B)" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-5 animate-pulse"
            style={{ background: "linear-gradient(135deg, #15919B, #09D1C7)" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 animate-bounce"
            style={{ background: "linear-gradient(135deg, #CDFFFC, #E0FFFE)" }}
          ></div>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--border-color)",
            color: "var(--text-color)"
          }}
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>
      </div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        <div
          className="p-8 rounded-3xl shadow-2xl backdrop-blur-sm border border-opacity-20 relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--border-color)",
            boxShadow: "0 25px 50px -12px rgba(9, 209, 199, 0.25)",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#09D1C7]/5 to-[#15919B]/5 rounded-3xl"></div>
          
          {/* Logo & Brand */}
          <div className="text-center mb-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:rotate-6"
                  style={{ 
                    background: "linear-gradient(135deg, #09D1C7, #15919B)"
                  }}
                >
                  <img src={LogoIcon} alt="WorkHole Logo" className="w-12 h-12 filter brightness-0 invert" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#09D1C7] to-[#15919B] rounded-2xl opacity-20 blur-lg"></div>
              </div>
            </div>
            <h1
              className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#09D1C7] to-[#15919B] bg-clip-text text-transparent"
            >
              {t('login.welcomeBack')}
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--sub-text-color)" }}>
              {t('login.signInToContinue')}{" "}
              <span className="font-semibold bg-gradient-to-r from-[#09D1C7] to-[#15919B] bg-clip-text text-transparent">
                WorkHole
              </span>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {t('login.emailAddress')}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-colors duration-200`}>
                  <Mail
                    className="w-5 h-5 group-focus-within:text-[#09D1C7] transition-colors duration-200"
                    style={{ color: "var(--sub-text-color)" }}
                  />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('login.enterEmail')}
                  className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3.5 rounded-xl border-2 transition-all duration-300 outline-none focus:ring-2 focus:ring-[#09D1C7]/30 focus:border-[#09D1C7] hover:border-[#09D1C7]/50`}
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#09D1C7]/10 to-[#15919B]/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {t('login.password')}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-colors duration-200`}>
                  <Lock
                    className="w-5 h-5 group-focus-within:text-[#09D1C7] transition-colors duration-200"
                    style={{ color: "var(--sub-text-color)" }}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={t('login.enterPassword')}
                  className={`w-full ${isRtl ? 'pr-10 pl-12' : 'pl-10 pr-12'} py-3.5 rounded-xl border-2 transition-all duration-300 outline-none focus:ring-2 focus:ring-[#09D1C7]/30 focus:border-[#09D1C7] hover:border-[#09D1C7]/50`}
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${isRtl ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center group hover:bg-[#09D1C7]/10 rounded-r-xl transition-all duration-200`}
                >
                  {showPassword ? (
                    <EyeOff
                      className="w-5 h-5 hover:text-[#09D1C7] transition-colors duration-200"
                      style={{ color: "var(--sub-text-color)" }}
                    />
                  ) : (
                    <Eye
                      className="w-5 h-5 hover:text-[#09D1C7] transition-colors duration-200"
                      style={{ color: "var(--sub-text-color)" }}
                    />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#09D1C7]/10 to-[#15919B]/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      rememberMe
                        ? 'bg-gradient-to-r from-[#09D1C7] to-[#15919B] border-[#09D1C7]'
                        : 'border-gray-300 hover:border-[#09D1C7]/50'
                    }`}
                    style={{
                      borderColor: rememberMe ? "#09D1C7" : "var(--border-color)"
                    }}
                  >
                    {rememberMe && (
                      <CheckCircle className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <span
                  className={`text-sm transition-colors duration-200 group-hover:text-[#09D1C7] ${isRtl ? 'mr-3' : 'ml-3'}`}
                  style={{ color: "var(--sub-text-color)" }}
                >
                  {t('login.rememberMe')}
                </span>
              </label>
              <Link
                to="/forget-password"
                className="text-sm font-semibold hover:underline transition-all duration-200 hover:text-[#15919B]"
                style={{ color: "#09D1C7" }}
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            {/* Login Button */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #09D1C7, #15919B)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('login.signingIn')}
                    </>
                  ) : (
                    <>
                      {t('login.signIn')}
                      {isRtl ? (
                        <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      ) : (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      )}
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
              {t('login.secureLogin')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
