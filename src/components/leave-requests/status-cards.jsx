import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../Time_Tracking_Components/Stats/Card";
import { useTranslation } from "react-i18next";

const LeaveStatusCards = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const statusCardsData = [
        {
            header: t("leaves.statusCards.annualLeave"),
            title: "6",
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
            title: "2",
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
            title: "1",
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
            title: "0",
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

    const summaryCardsData = [
        {
            header: t("leaves.summaryCards.availableLeaves"),
            title: "10",
            subTitle: t("leaves.summaryCards.totalAvailable"),
            bgColor: "#E3F2FD",
            textColor: "#1976D2",
        },
        {
            header: t("leaves.summaryCards.rejectedLeaves"),
            title: "3",
            subTitle: t("leaves.summaryCards.totalRejected"),
            bgColor: "#FFEBEE",
            textColor: "#D32F2F",
        },
        {
            header: t("leaves.summaryCards.pendingLeaves"),
            title: "6",
            subTitle: t("leaves.summaryCards.awaitingApproval"),
            bgColor: "#FFF3E0",
            textColor: "#F57C00",
        },
        {
            header: t("leaves.summaryCards.approvedLeaves"),
            title: "4",
            subTitle: t("leaves.summaryCards.totalApproved"),
            bgColor: "#E8F5E8",
            textColor: "#388E3C",
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
                        subTitle={card.subTitle}
                        rightIcon={card.rightIcon}
                        className="h-full"
                    />
                ))}
            </div>
        </div>
    );
};

export default LeaveStatusCards;

