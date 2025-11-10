import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import CompanyDetailsCard from "../../../components/admin/company/company-details-card";

const Company = () => {
  return (
    <div className="flex h-screen w-full flex-col" style={{ background: "var(--bg-all)" }}>
      <NavBarAdmin />

      <div className="flex flex-1 min-h-0">
        <SideBarAdmin />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:px-12">


            <CompanyDetailsCard />

            <section
              className="rounded-3xl border overflow-hidden"
              style={{
                background: "var(--bg-color)",
                borderColor: "var(--border-color)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
            
              
          
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Company;