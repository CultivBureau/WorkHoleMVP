import React from 'react'
import { useTranslation } from "react-i18next"

const AccountAccessSection = ({ accountAccess }) => {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Enhanced User Credentials Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-3 group">
          <label 
            className="text-xs sm:text-sm font-semibold block uppercase tracking-wide transition-colors duration-200"
            style={{ color: 'var(--sub-text-color)' }}
          >
            {t("profile.emailAddress")}
          </label>
          <div 
            className="p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-sm"
          >
            <p 
              className="text-sm sm:text-base font-medium break-all sm:break-normal"
              style={{ color: 'var(--text-color)' }}
            >
              {accountAccess.emailAddress}
            </p>
          </div>
        </div>
        <div className="space-y-3 group">
          <label 
            className="text-xs sm:text-sm font-semibold block uppercase tracking-wide transition-colors duration-200"
            style={{ color: 'var(--sub-text-color)' }}
          >
            {t("employees.newEmployeeForm.professionalInfo.userName")}
          </label>
          <div 
            className="p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-sm"
          >
            <p 
              className="text-sm sm:text-base font-medium"
              style={{ color: 'var(--text-color)' }}
            >
              {accountAccess.userName}
            </p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Role & Permissions Section */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 
              className="text-xl sm:text-2xl font-bold"
              style={{ color: 'var(--text-color)' }}
            >
              {t("roles.title")}
            </h3>
            <p 
              className="text-xs sm:text-sm font-medium"
              style={{ color: 'var(--sub-text-color)' }}
            >
              {t("roles.pageDescription")}
            </p>
          </div>
          <div 
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md self-start"
            style={{ 
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)'
            }}
          >
            <span className="text-xs sm:text-sm font-semibold">{t("roles.table.role")}</span>
          </div>
        </div>
        
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {Object.entries(accountAccess.permissions).map(([category, permissions]) => (
            <div key={category} className="space-y-4 sm:space-y-5">
              <h4 
                className="text-lg sm:text-xl font-bold capitalize pb-2 border-b"
                style={{ 
                  color: 'var(--text-color)',
                  borderColor: 'var(--divider-color)'
                }}
              >
                {category.replace(/([A-Z])/g, ' $1')}
              </h4>
              
              <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
                {permissions.map((permission, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    <div 
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 shadow-sm transition-all duration-200 group-hover:scale-110"
                      style={{ 
                        background: 'linear-gradient(135deg, #09D1C7 0%, #15919B 100%)',
                        boxShadow: '0 2px 8px rgba(9, 209, 199, 0.3)'
                      }}
                    />
                    <span 
                      className="text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-200 group-hover:opacity-80"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {permission}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AccountAccessSection
