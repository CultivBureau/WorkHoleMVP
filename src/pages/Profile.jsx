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
import { useLocation } from "react-router-dom"

const Profile = () => {
  const { isRtl } = useLang()
  const { t } = useTranslation()
  const location = useLocation()
  
  // Check if we're viewing an employee from admin panel
  const isAdminView = location.state?.isAdminView || false
  const employeeData = location.state?.employeeData || null
  
  const {
    userData,
    fieldLabels,
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    renderContent
  } = useProfile(isRtl)

  // Use employee data if available, otherwise use default user data
  const displayData = employeeData ? {
    firstName: employeeData.name?.split(' ')[0] || 'N/A',
    lastName: employeeData.name?.split(' ').slice(1).join(' ') || 'N/A',
    email: employeeData.email || 'N/A',
    avatar: employeeData.avatar || 'https://ui-avatars.com/api/?name=Employee&background=15919B&color=fff&size=80',
    professionalInfo: {
      designation: employeeData.position || 'N/A',
      department: employeeData.department || 'N/A',
      employeeId: employeeData.employeeId || 'N/A',
      joinDate: employeeData.joinDate || 'N/A'
    },
    personalInfo: {
      firstName: employeeData.name?.split(' ')[0] || 'N/A',
      lastName: employeeData.name?.split(' ').slice(1).join(' ') || 'N/A',
      email: employeeData.email || 'N/A',
      mobileNumber: employeeData.mobileNumber || 'N/A',
      dateOfBirth: employeeData.dateOfBirth || 'N/A',
      gender: employeeData.gender || 'N/A',
      nationality: employeeData.nationality || 'N/A',
      address: employeeData.address || 'N/A',
      status: employeeData.status || 'N/A'
    },
    documents: {
      proofOfIdentity: employeeData.proofOfIdentity || null,
      employmentContract: employeeData.employmentContract || null,
      certificates: employeeData.certificates || null,
      socialInsurance: employeeData.socialInsurance || null
    },
    accountAccess: {
      username: employeeData.username || 'N/A',
      accessLevel: employeeData.accessLevel || 'Standard User',
      permissions: employeeData.permissions || 'Basic Access',
      lastLogin: employeeData.lastLogin || 'Never'
    },
    teamLeader: userData.teamLeader,
    teamLeaderAvatar: userData.teamLeaderAvatar
  } : userData

  const content = renderContent()

  // Handle back navigation
  const handleBack = () => {
    // If we're in a non-profile section, go back to profile
    if (activeSection !== 'profile') {
      setActiveSection('profile')
    } else {
      // If we're viewing from admin panel, go back to employees list
      if (isAdminView) {
        window.history.back()
      } else {
        // If we're in profile section, go back to dashboard or previous page
        window.history.back()
      }
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
                data={displayData.personalInfo} 
                fieldLabels={fieldLabels.personal} 
              />
            )}
            {activeTab === "professional" && (
              <DataReview 
                data={displayData.professionalInfo} 
                fieldLabels={fieldLabels.professional} 
              />
            )}
            {activeTab === "documents" && (
              <DocumentsSection documents={displayData.documents} />
            )}
            {activeTab === "account" && (
              <AccountAccessSection accountAccess={displayData.accountAccess} />
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
            firstName={displayData.firstName}
            lastName={displayData.lastName}
            email={displayData.email}
            role={displayData.professionalInfo.designation}
            avatar={displayData.avatar}
            teamLeader={displayData.teamLeader}
            teamLeaderAvatar={displayData.teamLeaderAvatar}
            isAdminView={isAdminView}
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