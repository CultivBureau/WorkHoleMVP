import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetEmployeeLeaveSummaryQuery } from "../../services/apis/DashboardApi";

const CompactLeaveSummaryCards = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch employee leave summary from API
  const { data: leaveSummary, isLoading } = useGetEmployeeLeaveSummaryQuery();
  
  // API returns: { value: { totalLeaveTypes, leaveTypes: [...] } } but is transformed to just return value object
  const totalLeaveTypes = leaveSummary?.totalLeaveTypes ?? 0;
  const leaveTypes = leaveSummary?.leaveTypes ?? [];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? leaveTypes.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === leaveTypes.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="w-full h-full border rounded-xl shadow-sm py-4 sm:py-5 md:py-6 lg:py-4 xl:py-5 2xl:py-8 px-3 sm:px-4 md:px-5 lg:px-3 xl:px-4 2xl:px-6 flex items-center justify-center" style={{ border: `1px solid var(--border-color)` }}>
        <div className="text-center" style={{ color: "var(--text-color)" }}>
          {t("loading") || "Loading..."}
        </div>
      </div>
    );
  }

  if (!leaveTypes || leaveTypes.length === 0) {
    return (
      <div className="w-full h-full border rounded-xl shadow-sm py-4 sm:py-5 md:py-6 lg:py-4 xl:py-5 2xl:py-8 px-3 sm:px-4 md:px-5 lg:px-3 xl:px-4 2xl:px-6 flex items-center justify-center" style={{ border: `1px solid var(--border-color)` }}>
        <div className="text-center" style={{ color: "var(--text-color)" }}>
          {t("leaves.noLeaveTypes") || "No leave types available"}
        </div>
      </div>
    );
  }

  const currentLeaveType = leaveTypes[currentSlide];

  const summaryCardsData = [
    {
      id: 1,
      count: currentLeaveType?.availableLeavesDays ?? 0,
      title: t("leaves.summaryCards.availableLeaves"),
      boxClass: "available-leave-box",
    },
    {
      id: 2,
      count: currentLeaveType?.rejectedLeavesDays ?? 0,
      title: t("leaves.summaryCards.rejectedLeaves"),
      boxClass: "rejected-leave-box",
    },
    {
      id: 3,
      count: currentLeaveType?.pendingLeavesDays ?? 0,
      title: t("leaves.summaryCards.pendingLeaves"),
      boxClass: "pending-leave-box",
    },
    {
      id: 4,
      count: currentLeaveType?.approvedLeavesDays ?? 0,
      title: t("leaves.summaryCards.approvedLeaves"),
      boxClass: "approved-leave-box",
    },
  ];

  return (
    <div className="w-full h-full border rounded-xl shadow-sm py-4 sm:py-5 md:py-6 lg:py-4 xl:py-5 2xl:py-8 px-3 sm:px-4 md:px-5 lg:px-3 xl:px-4 2xl:px-6" style={{ border: `1px solid var(--border-color)` }}>
      {/* Header with Leave Type Title and Navigation */}
      <div className="flex items-center justify-between mb-4" dir={isArabic ? "rtl" : "ltr"}>
        <h2 
          className="text-base sm:text-lg lg:text-base xl:text-lg 2xl:text-xl font-bold"
          style={{ color: "var(--text-color)" }}
        >
          {currentLeaveType?.leaveTypeName} {t("leaves.title") || "Leaves"}
        </h2>
        
        {/* Navigation Arrows */}
        {leaveTypes.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={isArabic ? handleNextSlide : handlePrevSlide}
              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: "var(--bg-color)",
                border: `1px solid var(--border-color)`,
                color: "var(--text-color)",
              }}
              aria-label={t("previous") || "Previous"}
            >
              {isArabic ? (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            
            <span 
              className="text-xs sm:text-sm font-medium px-2"
              style={{ color: "var(--sub-text-color)" }}
            >
              {currentSlide + 1} / {totalLeaveTypes}
            </span>
            
            <button
              onClick={isArabic ? handlePrevSlide : handleNextSlide}
              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: "var(--bg-color)",
                border: `1px solid var(--border-color)`,
                color: "var(--text-color)",
              }}
              aria-label={t("next") || "Next"}
            >
              {isArabic ? (
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-3 xl:gap-4 2xl:gap-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {summaryCardsData.map((card) => (
          <div
            key={card.id}
            className="rounded-lg sm:rounded-xl lg:rounded-lg xl:rounded-xl 2xl:rounded-2xl p-3 sm:p-4 lg:p-3 xl:p-4 2xl:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
            style={{
              backgroundColor: "var(--bg-color)",
              border: `1px solid var(--border-color)`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-3 xl:gap-4 2xl:gap-6">
              {/* Colored Box with Number - Bigger and more responsive */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-20 2xl:h-20 rounded-lg sm:rounded-xl lg:rounded-lg xl:rounded-xl 2xl:rounded-2xl flex items-center justify-center text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-2xl font-bold flex-shrink-0 transition-all duration-300 hover:scale-110 ${card.boxClass}`}
              >
                {card.count}
              </div>

              {/* Title - Bigger and more responsive */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-lg font-semibold leading-tight break-words transition-all duration-200"
                  style={{ color: "var(--text-color)" }}
                >
                  {card.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompactLeaveSummaryCards;