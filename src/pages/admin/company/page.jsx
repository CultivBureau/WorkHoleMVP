import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import CompanyDetailsCard from "../../../components/admin/company/company-details-card";
import QuickActions from "../../../components/admin/company/quick-actions";

const Company = () => {
  return (
    <div className="flex h-screen w-full flex-col" style={{ background: "var(--bg-all)" }}>
      <NavBarAdmin />

      <div className="flex flex-1 min-h-0">
        <SideBarAdmin />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:px-12">
            <header className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-2.5 rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-md"
                  style={{
                    background: "linear-gradient(135deg, var(--container-color) 0%, var(--bg-color) 100%)",
                    color: "var(--accent-color)",
                    border: "2px solid var(--accent-color)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-color)" }} />
                  Admin · Company
                </span>
              </div>
              <h1 
                className="text-4xl font-black tracking-tight md:text-5xl text-start lg:text-6xl" 
                style={{ 
                  color: "var(--text-color)",
                  lineHeight: "1.1"
                }}
              >
                Company Workspace
              </h1>
              <p 
                className="max-w-3xl text-base leading-relaxed text-start font-medium" 
                style={{ color: "var(--sub-text-color)" }}
              >
                Keep your organization's profile, subscription and compliance artefacts aligned. Update information, review attachments and trigger quick actions from a single dashboard.
              </p>
            </header>

            <CompanyDetailsCard />

            <section
              className="rounded-3xl border overflow-hidden"
              style={{
                background: "var(--bg-color)",
                borderColor: "var(--border-color)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* Gradient Top Bar */}
              <div 
                className="h-2 w-full"
                style={{
                  background: "linear-gradient(90deg, #15919B 0%, #09D1C7 100%)",
                }}
              />
              
              <div className="px-8 py-10 sm:px-12">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-b-2 pb-8" style={{ borderColor: "var(--border-color)" }}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, #15919B 0%, #09D1C7 100%)" }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>
                        Quick Actions
                      </h2>
                    </div>
                    <p className="text-base font-medium pl-14" style={{ color: "var(--sub-text-color)" }}>
                      Shortcuts curated for day-to-day operations and configuration tweaks.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <QuickActions />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Company;