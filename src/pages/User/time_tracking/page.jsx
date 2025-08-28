import React, { useEffect } from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import Stats from "../../../components/Time_Tracking_Components/Stats/Stats";
import MainSection from "../../../components/Time_Tracking_Components/MainSection/MainSection";
import { useTranslation } from "react-i18next";

const TimeTracking = ({ lang, setLang }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar lang={lang} setLang={setLang} />

      {/* Content Area with SideMenu and Main Content */}
      <div
        className="flex flex-1 min-h-0 "
        style={{ background: "var(--bg-all)" }}
      >
        {/* Side Menu - Left side under navbar */}
        <SideMenu lang={lang} />

        {/* Main Content - Rest of the space */}
        <main
          className="flex-1  overflow-auto p-4"
          style={{ background: "var(--bg-all)" }}
        >
          <div
            className=" rounded-2xl border border-white "
            style={{ background: "var(--bg-color)" }}
          >
            {/* TimeTracking content */}
            <Stats />
            <MainSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimeTracking;
