import React, { useState } from "react";
import { useLoginMutation } from "../../services/apis/AuthApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LogoIcon from "../../assets/side-menu-icons/logo.svg";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      toast.success("Login successful");
      
      // Redirect based on user role
      if (res.user?.role === "admin") {
        navigate("/pages/admin/dashboard");
      } else {
        navigate("/pages/User/dashboard");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg-color)" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10"
          style={{ background: "var(--gradient-start)" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-5"
          style={{ background: "var(--gradient-end)" }}
        ></div>
      </div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-sm border"
        style={{
          backgroundColor: "var(--bg-color)",
          borderColor: "var(--border-color)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "var(--hover-color)" }}
            >
              <img src={LogoIcon} alt="WorkHole Logo" className="w-10 h-10" />
            </div>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-color)" }}
          >
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
            Sign in to continue to{" "}
            <span className="gradient-text font-semibold">WorkHole</span>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--text-color)" }}
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  className="w-5 h-5"
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
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                  focusRingColor: "var(--accent-color)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--accent-color)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--border-color)")
                }
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--text-color)" }}
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className="w-5 h-5"
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
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--accent-color)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--border-color)")
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff
                    className="w-5 h-5 hover:opacity-70 transition-opacity"
                    style={{ color: "var(--sub-text-color)" }}
                  />
                ) : (
                  <Eye
                    className="w-5 h-5 hover:opacity-70 transition-opacity"
                    style={{ color: "var(--sub-text-color)" }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 mr-2"
                style={{ accentColor: "var(--accent-color)" }}
              />
              <span
                className="text-sm"
                style={{ color: "var(--sub-text-color)" }}
              >
                Remember me
              </span>
            </label>
<Link
  to="/forget-password"
  className="text-sm font-semibold hover:underline"
  style={{ color: "var(--accent-color)" }}
>
  Forgot Password?
</Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-white text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] gradient-bg"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>


      </div>
    </div>
  );
};

export default Login;
