"use client"

import { Mail, Briefcase } from "lucide-react"
import { useTranslation } from "react-i18next"

const HeaderSection = ({ userData }) => {
  const { t } = useTranslation()
   
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        {/* Left side - User Info */}
        <div className="flex items-start gap-4">
          {/* User Profile Section */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full overflow-hidden border-2"
              style={{ borderColor: "var(--border-color)" }}
            >
              <img
                src="/assets/profile/brooklyn.jpg"
                alt="Brooklyn Simmons"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div
                className="w-full h-full rounded-full items-center justify-center text-lg font-bold hidden"
                style={{
                  backgroundColor: "var(--container-color)",
                  color: "var(--text-color)"
                }}
              >
                BS
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-1" style={{ color: "var(--text-color)" }}>
              Brooklyn Simmons
            </h1>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-3 h-3" style={{ color: "var(--sub-text-color)" }} />
              <span className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                {t("profile.projectManager")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" style={{ color: "var(--sub-text-color)" }} />
              <span className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                brooklyn.s@example.com
              </span>
            </div>
          </div>

          {/* Team Lead Badge */}
          <div>
            <div className="text-[10px] font-medium mb-1" style={{ color: "var(--sub-text-color)" }}>
              {t("profile.teamLead")}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--container-color)",
                    color: "var(--text-color)"
                  }}
                >
                  LA
                </div>
              </div>
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--text-color)" }}>
                  Leslie Alexander
                </div>
                <div className="text-[10px]" style={{ color: "var(--sub-text-color)" }}>
                  {t("profile.srProjectManager")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Edit Button - COMMENTED OUT */}
        {/* 
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-bg text-white text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
          <Edit className="w-3 h-3" />
          {t("profile.editProfile")}
        </button>
        */}
      </div>

      {/* Divider */}
      <div className="w-full h-px mb-8" style={{ backgroundColor: "var(--border-color)" }}></div>
    </div>
  )
}

export default HeaderSection
