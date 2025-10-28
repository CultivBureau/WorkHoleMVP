import React, { useState } from "react";
import { useLoginMutation } from "../../services/apis/AuthApi";
import { useGetUserCompaniesByEmailMutation } from "../../services/apis/CompanyApi";
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
  Loader2,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const [getUserCompanies, { isLoading: isLoadingCompanies }] = useGetUserCompaniesByEmailMutation();
  
  const [step, setStep] = useState(1); // 1 = email step, 2 = company/password step
  const [email, setEmail] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyId: "",
  });

  const isRtl = i18n.language === 'ar';

  // Step 1: Handle email submission to fetch companies
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('login.enterEmail') || 'Please enter your email');
      return;
    }

    try {
      const result = await getUserCompanies(email).unwrap();
      const fetchedCompanies = result.value || [];
      
      if (fetchedCompanies.length === 0) {
        toast.error(t('login.noCompanies') || 'No companies found for this email');
        return;
      }

      setCompanies(fetchedCompanies);
      setStep(2); // Move to company/password step
    } catch (err) {
      const errorMessage = err?.data?.errorMessage || err?.data?.message || err?.message || 'Failed to fetch companies';
      toast.error(errorMessage);
    }
  };

  // Step 2: Handle final login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompany || !formData.password) {
      toast.error(t('login.fillAllFields') || 'Please fill all fields');
      return;
    }

    try {
      const loginPayload = {
        email: email,
        password: formData.password,
        companyId: selectedCompany.companyId,
      };

      const res = await login(loginPayload).unwrap();
      toast.success(t('login.loginSuccess') || 'Login successful!');

      // Handle new API response structure
      const userData = res.value || res;
      
      // For now, navigate to user dashboard
      navigate("/pages/User/dashboard");

      // Auto refresh the app after successful login
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (err) {
      const errorMessage = err?.data?.errorMessage || err?.data?.message || err?.message || t('login.loginFailed');
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBackToEmail = () => {
    setStep(1);
    setSelectedCompany(null);
    setCompanies([]);
    setFormData({ ...formData, password: "" });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen h-screen flex overflow-hidden">
      {/* Left Panel - hidden on mobile */}
      <div className="hidden lg:flex flex-1 bg-[var(--bg-color)] items-center justify-center relative overflow-hidden">
        <img
          src="/assets/back.png"
          alt="Login dashboard mockup"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:flex-1 bg-[var(--bg-color)] lg:border-l border-[var(--border-color)] lg:rounded-l-3xl lg:shadow-2xl lg:shadow-gray-500 flex items-center justify-center relative">
        {/* Language Toggle */}
        <div className={`absolute top-4 z-10 ${isRtl ? "left-4" : "right-4"}`}>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <Globe className="w-4 h-4" />
            <span>
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </span>
          </button>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md px-6 py-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={LogoIcon} alt="WorkHole" className="w-10 h-10" />
              <h1 className="text-3xl">
                <span className="font-bold gradient-text">Work</span>
                <span style={{ color: "var(--text-color)" }}>Hole</span>
              </h1>
            </div>
            <img
              src="/assets/Login.png"
              alt="Login Illustration"
              className="mx-auto mb-6 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
            />
          </div>

          {/* Login Form - Step 1: Email */}
          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className={`text-gray-600 block text-sm ${isRtl ? "text-right" : "text-left"}`}
                >
                  {t('login.emailAddress')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('login.enterEmail')}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${isRtl ? "text-right" : "text-left"}`}
                  dir={isRtl ? "rtl" : "ltr"}
                />
              </div>

              {/* Submit Button for Step 1 */}
              <button
                type="submit"
                disabled={isLoadingCompanies || !email}
                className="w-full gradient-bg text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingCompanies ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('login.loading') || 'Loading...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{t('login.continue') || 'Continue'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </form>
          ) : (
            /* Login Form - Step 2: Company Selection & Password */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToEmail}
                className={`flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors mb-2 ${isRtl ? "ml-auto" : ""}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('login.backToEmail') || 'Back to email'}</span>
              </button>

              {/* Company Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="company"
                  className={`text-gray-600 block text-sm ${isRtl ? "text-right" : "text-left"}`}
                >
                  {t('login.selectCompany') || 'Select Company'}
                </label>
                <div className="space-y-2">
                  {companies.map((company) => (
                    <button
                      key={company.companyId}
                      type="button"
                      onClick={() => setSelectedCompany(company)}
                      className={`w-full px-4 py-3 border rounded-lg text-sm transition-all text-left ${
                        selectedCompany?.companyId === company.companyId
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        <span className="font-medium">{company.companyName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <label
                    htmlFor="password"
                    className={`text-gray-600 block text-sm ${isRtl ? "text-right" : "text-left"}`}
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
                    className={`w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${isRtl ? "text-right pr-12 pl-4" : "text-left pl-4 pr-12"}`}
                    dir={isRtl ? "rtl" : "ltr"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRtl ? "left-3" : "right-3"} top-[38px] text-gray-400 hover:text-gray-600`}
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
                  <span className={`text-sm text-gray-600 ${isRtl ? "mr-2" : "ml-2"}`}>
                    {t('login.rememberMe')}
                  </span>
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
                disabled={isLoading || !selectedCompany || !formData.password}
                className="w-full gradient-bg text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('login.signingIn')}</span>
                  </div>
                ) : (
                  t('login.signIn')
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
