import React from "react";
import Card from "./Card";
import { Clock, Calendar, Coffee, TrendingUp } from "lucide-react";
import ClockIcon from "../../../../public/assets/dashboard_card/clock.svg";
import ClockIcon2 from "../../../../public/assets/dashboard_card/clock2.svg";
import ClockIcon3 from "../../../../public/assets/dashboard_card/clock3.svg";
import BreakIcon from "../../../../public/assets/dashboard_card/break.svg";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();
  
  const Card_Data = [
    {
      header: t("dashboard.statusCards.dailyShift"),
      title: `2:15:00`,
      subTitle: t("dashboard.statusCards.hoursWorked"),
      icon: ClockIcon,
      bar: 45,
    },
    {
      header: t("stats.thisWeek"),
      title: `34:15:00`,
      subTitle: t("stats.totalHoursWorked"),
      icon: ClockIcon2,
      bar: 75,
    },
    {
      header: t("stats.breaksTaken"),
      title: `22${t("timeUnits.minutes")}`,
      subTitle: t("breakTime.breakSummary"),
      icon: BreakIcon,
      bar: 30,
    },
    {
      header: t("stats.totalOvertime"),
      title: `3${t("timeUnits.hours")}`,
      subTitle: t("stats.extraHoursThisMonth"),
      icon: ClockIcon3,
      bar: 60,
      percentage: 1.3,
    },
  ];

  return (
    <section
      className="w-full flex justify-center items-center gap-6 p-6"
      style={{ backgroundColor: "var(--bg-color)" }}
    >
      {Card_Data.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </section>
  );
};

export default Stats;
