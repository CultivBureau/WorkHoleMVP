import "./App.css";
import SideMenu from "./components/side-menu/side-menu";
import NavBar from "./components/NavBar/navbar";
import { useState, useEffect } from "react";

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-color)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar lang={lang} setLang={setLang} />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Side Menu - Left side under navbar */}
        <SideMenu lang={lang} />

        {/* Main Content - Rest of the space */}
        <main className="flex-1 overflow-auto p-4">
          <div
            className="h-full rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Dashboard content */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
