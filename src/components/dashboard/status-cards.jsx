"use client"
import { useTranslation } from "react-i18next";
import Card from "../Time_Tracking_Components/Stats/Card"

export default function StatusCards() {
  const { t } = useTranslation();

  const cardsData = [
    {
      header: t("dashboard.statusCards.status"),
      title: t("dashboard.statusCards.notClockedIn"),
      subTitle: t("dashboard.statusCards.goToTimeTracker"),
      icon: "/assets/dashboard_card/status.svg",
      bar: 0,
      percentage: null
    },
    {
      header: t("dashboard.statusCards.leaveRequest"),
      title: t("dashboard.statusCards.noLeaveRequest"),
      subTitle: t("dashboard.statusCards.noRequestText"),
      icon: "/assets/dashboard_card/clock.svg",
      bar: 0,
      percentage: null
    },
    {
      header: t("dashboard.statusCards.dailyShift"),
      title: "2:15:00",
      subTitle: t("dashboard.statusCards.hoursWorked"),
      icon: "/assets/dashboard_card/clock2.svg",
      bar: 35,
      percentage: null
    },
    {
      header: t("dashboard.statusCards.performance"),
      title: "75%",
      subTitle: t("dashboard.statusCards.tasksCompleted"),
      icon: "/assets/dashboard_card/performance.svg",
      bar: 75,
      percentage: 12
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          header={card.header}
          title={card.title}
          subTitle={card.subTitle}
          icon={card.icon}
          bar={card.bar}
          percentage={card.percentage}
        />
      ))}
    </div>
  )
}
