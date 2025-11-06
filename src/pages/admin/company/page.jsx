import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import StatusCards from "../../../components/admin/company/status-cards";
import CompanyTable from "../../../components/admin/company/table";
import CenterContent from "../../../components/admin/company/center-content";
import CompanyDetailsCard from "../../../components/admin/company/company-details-card";
import QuickActions from "../../../components/admin/company/quick-actions";

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
          {/* Company Details Card */}
          <CompanyDetailsCard />
          
          {/* Quick Actions Section */}
          <div className="w-full px-6 pb-6">
            <div className="mb-4">
              <h3 className="text-2xl font-bold gradient-text">Quick Actions</h3>
              <p style={{ color: "var(--sub-text-color)" }} className="text-sm mt-1">
                Manage your company settings and configurations
              </p>
            </div>
            <QuickActions />
          </div>
          
          {/* Additional content can be added here */}
          {/* <div className="w-full h-max p-6">
            <StatusCards />
            <CenterContent />
            <CompanyTable />
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default Company;