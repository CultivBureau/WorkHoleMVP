import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../Time_Tracking_Components/Stats/Card";
import { useTranslation } from "react-i18next";
import { useGetLeaveStatsQuery } from "../../services/apis/LeavesApi";

const LeaveStatusCards = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    // Fetch leave stats from API
    const { data: stats, isLoading } = useGetLeaveStatsQuery();

    // Fallback to 0 if stats not loaded yet
    const leaveTypeCounts = stats?.leaveTypeCounts || {};

    const statusCardsData = [
        {
            header: t("leaves.statusCards.annualLeave"),
            title: isLoading ? "..." : (leaveTypeCounts.annualLeaves ?? 0),
            subTitle: t("leaves.statusCards.daysLeftThisYear"),
            rightIcon: (
                <img
                    src="/assets/leaves/anual.svg"
                    alt="annual leave"
                    className="w-8 h-8"
                />
            ),
        },
        {
            header: t("leaves.statusCards.sickLeave"),
            title: isLoading ? "..." : (leaveTypeCounts.sickLeaves ?? 0),
            subTitle: t("leaves.statusCards.daysLeft"),
            rightIcon: (
                <img
                    src="/assets/leaves/sick.svg"
                    alt="sick leave"
                    className="w-8 h-8"
                />
            ),
        },
        {
            header: t("leaves.statusCards.emergencyLeave"),
            title: isLoading ? "..." : (leaveTypeCounts.emergencyLeaves ?? 0),
            subTitle: t("leaves.statusCards.daysLeft"),
            rightIcon: (
                <img
                    src="/assets/leaves/emergency.svg"
                    alt="emergency leave"
                    className="w-8 h-8"
                />
            ),
        },
        {
            header: t("leaves.statusCards.unpaidLeave"),
            title: isLoading ? "..." : (leaveTypeCounts.unpaidLeaves ?? 0),
            subTitle: t("leaves.statusCards.daysLeft"),
            rightIcon: (
                <img
                    src="/assets/leaves/unpaid.svg"
                    alt="unpaid leave"
                    className="w-8 h-8"
                />
            ),
        },
    ];

    return (
        <div className="space-y-6 mb-6">
            {/* Top Row - Leave Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusCardsData.map((card, index) => (
                    <Card
                        key={index}
                        header={card.header}
                        title={card.title}
                        rightIcon={card.rightIcon}
                        className="h-full"
                    />
                ))}
            </div>
        </div>
    );
};

export default LeaveStatusCards;

