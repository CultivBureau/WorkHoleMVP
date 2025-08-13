import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import Stats from "../../../components/Time_Tracking_Components/Stats/Stats";
const TimeTracking = ({ lang, setLang }) => {
  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar - Full Width at Top */}
      <NavBar lang={lang} setLang={setLang} />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0 " style={{ background: "var(--bg-all)" }}>
        {/* Side Menu - Left side under navbar */}
        <SideMenu lang={lang} />

        {/* Main Content - Rest of the space */}
        <main className="flex-1 overflow-auto p-4" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-full rounded-[39px] border border-white "
            style={{ background: "var(--bg-color)" }}
          >
            {/* TimeTracking content */}
            <Stats />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimeTracking;
