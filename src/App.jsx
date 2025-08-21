import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./pages/User/dashboard/page";
import Leaves from "./pages/User/leaves/page";
import TimeTracking from "./pages/User/time_tracking/page";
import AttendanceLogs from "./pages/User/attendance-logs/page";
import Profile from "./pages/User/profile/page";
import { useState, useEffect } from "react";

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/pages/User/dashboard"
          element={<Dashboard lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/pages/User/leaves"
          element={<Leaves lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/pages/User/time_tracking"
          element={<TimeTracking lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/pages/User/attendance-logs"
          element={<AttendanceLogs lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/pages/User/profile"
          element={<Profile lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
