import React from "react";
import Card from "./Card";
import ClockIcon from "../../../../public/assets/dashboard_card/clock.svg";
import ClockIcon2 from "../../../../public/assets/dashboard_card/clock2.svg";
import ClockIcon3 from "../../../../public/assets/dashboard_card/clock3.svg";
import BreakIcon from "../../../../public/assets/dashboard_card/break.svg";
import { useTranslation } from "react-i18next";
import TimerCard from "./TimerCard";
const Stats = () => {
  const { t } = useTranslation();
  
  const Card_Data = [

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
      className="w-full h-[22vh] flex justify-center items-stretch gap-6 p-6"
      style={{ backgroundColor: "var(--bg-color)" }}
    >
      <TimerCard />
      {Card_Data.map((card, index) => (
        <Card key={index} {...card} className="h-full" />
      ))}
    </section>
  );
};

export default Stats;
