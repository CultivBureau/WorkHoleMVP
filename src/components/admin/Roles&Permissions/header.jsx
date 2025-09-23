import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

const Header = ({ searchValue, onSearchChange }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";

    const handleAddNewRole = () => {
        navigate("/pages/admin/New_Role");
    };

    return (
        <div className="w-full mb-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                {/* Title and Description */}
                <div className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}>
                    <h1
                        className="text-lg md:text-xl font-bold mb-2"
                        style={{
                            color: "var(--text-color)",
                            direction: isArabic ? "rtl" : "ltr"
                        }}
                    >
                        {t('roles.title')}
                    </h1>
                    <p
                        className="text-xs md:text-sm"
                        style={{
                            color: "var(--sub-text-color)",
                            direction: isArabic ? "rtl" : "ltr"
                        }}
                    >
                        {t('roles.description')}
                    </p>
                </div>

                {/* Actions Section */}
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:min-w-[280px] lg:min-w-[320px]">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search
                                className="w-4 h-4"
                                style={{ color: "var(--sub-text-color)" }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder={t('roles.searchPlaceholder')}
                            value={searchValue || ""}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            style={{
                                backgroundColor: "var(--input-bg)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-color)",
                                fontSize: "13px",
                                direction: isArabic ? "rtl" : "ltr",
                                paddingLeft: isArabic ? "1rem" : "2.5rem",
                                paddingRight: isArabic ? "2.5rem" : "1rem",
                            }}
                        />
                        {isArabic && (
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <Search
                                    className="w-4 h-4"
                                    style={{ color: "var(--sub-text-color)" }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Add New Role Button */}
                    <button
                        onClick={handleAddNewRole}
                        className="flex gradient-bg items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap  text-white hover:shadow-lg text-sm"

                    >
                        <Plus className="w-4 h-4" />
                        <span>{t('roles.addNewRole')}</span>
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div
                className="w-full h-px"
                style={{ backgroundColor: "var(--border-color)" }}
            />
        </div>
    );
};

export default Header;