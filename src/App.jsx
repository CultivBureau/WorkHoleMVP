import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./pages/User/dashboard/page";
import Leaves from "./pages/User/leaves/page";
import TimeTracking from "./pages/User/time_tracking/page";
import AttendanceLogs from "./pages/User/attendance-logs/page";
import BreakTracking from "./pages/User/break-tracking/page";
import Profile from "./pages/Profile";
import ForgetPassword from "./components/forget-password/ForgetPassword";
import ResetPassword from "./components/reset-password/resetPassword";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/forget-password"
            element={<ForgetPassword />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          <Route
            path="/pages/User/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard lang={lang} setLang={setLang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/User/leaves"
            element={
              <ProtectedRoute>
                <Leaves lang={lang} setLang={setLang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/User/time_tracking"
            element={
              <ProtectedRoute>
                <TimeTracking lang={lang} setLang={setLang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/User/attendance-logs"
            element={
              <ProtectedRoute>
                <AttendanceLogs lang={lang} setLang={setLang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/User/break-tracking"
            element={
              <ProtectedRoute>
                <BreakTracking lang={lang} setLang={setLang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/User/profile"
            element={
              <ProtectedRoute>
                <Profile lang={lang} setLang={setLang} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
