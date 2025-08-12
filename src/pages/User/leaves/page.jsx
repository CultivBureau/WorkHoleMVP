import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";

const Leaves = ({ lang, setLang }) => {
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
            {/* Leaves content */}
            <h1>hello in leaves</h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaves;
