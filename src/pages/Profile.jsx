import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLang } from "../contexts/LangContext"
import { useProfile } from '../hooks/useProfile'
import HeaderSection from "../components/profile/sections/header-section"
import NavigationMenu from "../components/profile/sections/NavigationMenu"
import ProfileTabs from "../components/profile/sections/profile-tabs"
import DataReview from "../components/profile/sections/data-review"
import Table from "../components/profile/sections/Table"
import DocumentsSection from "../components/profile/sections/DocumentsSection"
import AccountAccessSection from "../components/profile/sections/AccountAccessSection"
import { useTranslation } from "react-i18next"

const Profile = () => {
  const { isRtl } = useLang()
  const { t } = useTranslation()
  const {
    userData,
    fieldLabels,
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    renderContent
  } = useProfile(isRtl)

  const content = renderContent()

  // Handle back navigation
  const handleBack = () => {
    // If we're in a non-profile section, go back to profile
    if (activeSection !== 'profile') {
      setActiveSection('profile')
    } else {
      // If we're in profile section, go back to dashboard or previous page
      window.history.back()
    }
  }

  const renderProfileContent = () => {
    if (content.type === "profile") {
      return (
        <>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-4 sm:mt-6 lg:mt-8">
            {activeTab === "personal" && (
              <DataReview 
                data={userData.personalInfo} 
                fieldLabels={fieldLabels.personal} 
              />
            )}
            {activeTab === "professional" && (
              <DataReview 
                data={userData.professionalInfo} 
                fieldLabels={fieldLabels.professional} 
              />
            )}
            {activeTab === "documents" && (
              <DocumentsSection documents={userData.documents} />
            )}
            {activeTab === "account" && (
              <AccountAccessSection accountAccess={userData.accountAccess} />
            )}
          </div>
        </>
      )
    }

    if (content.type === "table") {
      return (
        <Table 
          data={content.data} 
          columns={content.config.columns}
          title={content.config.title}
          statusConfig={content.config.statusConfig}
        />
      )
    }
  }

  return (
    <div 
      className="min-h-screen mt-4 sm:mt-6 lg:mt-10 p-4 sm:p-6 lg:p-8 transition-all duration-300"
      style={{ backgroundColor: 'var(--bg-all)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className={`mb-4 sm:mb-6 ${isRtl ? 'flex justify-end' : 'flex justify-start'}`}>
          <button
            onClick={handleBack}
            className={`
              flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border 
              transition-all duration-200 hover:scale-105 hover:shadow-md
              ${isRtl ? 'flex-row-reverse' : 'flex-row'}
            `}
            style={{ 
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {isRtl ? (
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--accent-color)' }} />
            ) : (
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--accent-color)' }} />
            )}
            <span className="font-medium text-xs sm:text-sm">
              {t("leaves.form.back")}
            </span>
          </button>
        </div>

        {/* Enhanced Header Section */}
        <div 
          className="rounded-xl sm:rounded-2xl border transition-all duration-300"
          style={{ 
            backgroundColor: 'var(--bg-color)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-color)'
          }}
        >
          <HeaderSection
            firstName={userData.firstName}
            lastName={userData.lastName}
            email={userData.email}
            role={userData.professionalInfo.designation}
            avatar={userData.avatar}
            teamLeader={userData.teamLeader}
            teamLeaderAvatar={userData.teamLeaderAvatar}
          />
        </div>

        {/* Horizontal Navigation Menu for 1024px-1140px range */}
        <div className="mt-4 sm:mt-6 lg:mt-8 xl:hidden">
          <NavigationMenu 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>

        {/* Enhanced Main Content Area - Custom responsive behavior for 1024px-1140px */}
        <div className="mt-4 sm:mt-6 lg:mt-8 xl:mt-0 flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Enhanced Navigation Sidebar - Only visible on xl screens and above */}
          <div className="w-full xl:w-[18%] mt-5 hidden xl:block">
            <NavigationMenu 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>

          {/* Enhanced Content Area - Full width in 1024px-1140px range */}
          <div 
            className="flex-1 p-4 sm:p-6 lg:p-8 mt-5 rounded-xl sm:rounded-2xl border transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-color)'
            }}
          >
            {renderProfileContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile