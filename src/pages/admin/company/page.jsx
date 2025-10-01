import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import StatusCards from "../../../components/admin/company/status-cards";
import CompanyTable from "../../../components/admin/company/table";
import CenterContent from "../../../components/admin/company/center-content";
const Company = () => {
  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      {/* Navigation Bar */}
      <NavBarAdmin />

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SideBarAdmin />


        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4" style={{ background: "var(--bg-all)" }}>
          <div
            className="h-max rounded-2xl border border-gray-200"
            style={{ background: "var(--bg-color)" }}
          >
            {/* Break Tracking content */}
            <div className="w-full h-max p-6">
              {/* Status Cards Row */}
              <StatusCards />
              <CenterContent />
              <CompanyTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Company;