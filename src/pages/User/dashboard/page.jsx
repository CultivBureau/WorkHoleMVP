import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";

const Dashboard = ({ lang, setLang }) => {
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
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
              <p>Welcome to your dashboard! Here you can manage your settings, view statistics, and more.</p>
              {/* Additional dashboard content can go here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
