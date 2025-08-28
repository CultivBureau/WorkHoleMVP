import React from "react";
import { useTranslation } from "react-i18next";
import { useGetLeaveStatsQuery } from "../../services/apis/LeavesApi";

const CompactLeaveSummaryCards = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Fetch leave stats from API
  const { data: stats, isLoading } = useGetLeaveStatsQuery();

  // Fallbacks if stats not loaded yet
  const statusCounts = stats?.statusCounts || {};
  const availableLeaves = stats?.availableLeaves ?? 0;

  const summaryCardsData = [
    {
      id: 1,
      count: isLoading ? "..." : availableLeaves,
      title: t("leaves.summaryCards.availableLeaves"),
      boxClass: "available-leave-box",
    },
    {
      id: 2,
      count: isLoading ? "..." : (statusCounts.rejectedLeaves ?? 0),
      title: t("leaves.summaryCards.rejectedLeaves"),
      boxClass: "rejected-leave-box",
    },
    {
      id: 3,
      count: isLoading ? "..." : (statusCounts.pendingLeaves ?? 0),
      title: t("leaves.summaryCards.pendingLeaves"),
      boxClass: "pending-leave-box",
    },
    {
      id: 4,
      count: isLoading ? "..." : (statusCounts.approvedLeaves ?? 0),
      title: t("leaves.summaryCards.approvedLeaves"),
      boxClass: "approved-leave-box",
    },
  ];

  return (
    <div className="w-full  h-full border rounded-xl shadow-sm py-8 px-4" style={{ border: `1px solid var(--border-color)` }}>
      <div
        className="grid grid-cols-2 gap-4"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {summaryCardsData.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            style={{
              backgroundColor: "var(--bg-color)",
              border: `1px solid var(--border-color)`,
            }}
          >
            <div className="flex items-center gap-4">
              {/* Colored Box with Number */}
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${card.boxClass}`}
              >
                {card.count}
              </div>

              {/* Title */}
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold leading-tight"
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