import React from "react";
import { useTranslation } from "react-i18next";

const CompactLeaveSummaryCards = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const summaryCardsData = [
    {
      id: 1,
      count: "10",
      title: t("leaves.summaryCards.availableLeaves"),
      bgColor: "#F0F9FF",
      textColor: "#0369A1",
      countBg: "#DBEAFE",
    },
    {
      id: 2,
      count: "3",
      title: t("leaves.summaryCards.rejectedLeaves"),
      bgColor: "#FEF2F2",
      textColor: "#DC2626",
      countBg: "#FECACA",
    },
    {
      id: 3,
      count: "6",
      title: t("leaves.summaryCards.pendingLeaves"),
      bgColor: "#FFFBEB",
      textColor: "#D97706",
      countBg: "#FED7AA",
    },
    {
      id: 4,
      count: "4",
      title: t("leaves.summaryCards.approvedLeaves"),
      bgColor: "#F0FDF4",
      textColor: "#16A34A",
      countBg: "#BBF7D0",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {summaryCardsData.map((card) => (
        <div
          key={card.id}
          className="rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          style={{
            backgroundColor: card.bgColor,
            border: `1px solid ${card.countBg}`,
          }}
        >
          <div className="text-center">
            {/* Large Count Number */}
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: card.countBg,
                color: card.textColor,
              }}
            >
              {card.count}
            </div>

            {/* Title */}
            <h3
              className="text-sm font-semibold"
              style={{ color: card.textColor }}
            >
              {card.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompactLeaveSummaryCards;