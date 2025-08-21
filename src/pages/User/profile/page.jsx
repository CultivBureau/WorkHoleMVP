"use client"

import { useState, useEffect } from "react"
import SideMenu from "../../../components/side-menu/side-menu"
import NavBar from "../../../components/NavBar/navbar"
import HeaderSection from "../../../components/profile/header-section"
import PersonalInfo from "../../../components/profile/personal-info"
import { useTranslation } from "react-i18next"
import "../../../i18n"

const Profile = () => {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language)

  // Sample user data - in real app this would come from props or API
  const userData = {
    name: "Brooklyn Simmons",
    role: "Project Manager",
    email: "brooklyn.s@example.com",
    firstName: "Brooklyn",
    lastName: "Simmons",
    mobile: "01110238273",
    department: "Project Manager",
    position: "Project Manager",
    dateOfBirth: "July 14, 1995",
    gender: "Female",
  }

  useEffect(() => {
    i18n.changeLanguage(lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    localStorage.setItem("lang", lang)
  }, [lang, i18n])

  const isRtl = i18n.dir() === "rtl"

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      {/* Navigation Bar - Full Width at Top */}
      <NavBar lang={lang} setLang={setLang} />

      {/* Content Area with SideMenu and Main Content */}
      <div className="flex flex-1 min-h-0" style={{ background: "var(--bg-all)" }}>
        {/* Side Menu - Left side under navbar */}
        <div className={isRtl ? 'order-2' : 'order-1'}>
          <SideMenu lang={lang} />
        </div>

        {/* Main Content - Rest of the space */}
        <main className={`flex-1 overflow-hidden py-4 order-2 ${isRtl ? 'pr-6 pl-4' : 'pl-6 pr-4'}`} style={{ background: "var(--bg-all)" }}>
          <div className="h-full rounded-2xl border relative overflow-auto" style={{ background: "var(--bg-color)", borderColor: "var(--border-color)" }}>
            {/* Profile content */}
            <div className="w-full h-full p-8">
              {/* Header Section */}
              <HeaderSection userData={userData} />

              {/* Personal Info Section */}
              <PersonalInfo userData={userData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile
