import React from "react";
import Card from "./Card";
import ClockIcon2 from "../../../../public/assets/dashboard_card/clock2.svg";
import ClockIcon3 from "../../../../public/assets/dashboard_card/clock3.svg";
import BreakIcon from "../../../../public/assets/dashboard_card/break.svg";
import { useTranslation } from "react-i18next";
import TimerCard from "./TimerCard";
import { useGetDashboardQuery } from "../../../services/apis/AtteandanceApi";

const Stats = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetDashboardQuery({});

  // fallback لو البيانات مش موجودة
  const stats = data || {
    thisWeek: "0h 0m",
    breaksTaken: "0h 0m",
    totalOvertime: "0h 0m",
  };

  const Card_Data = [
    {
      header: t("stats.thisWeek"),
      title: stats.thisWeek,
      subTitle: t("stats.totalHoursWorked"),
      icon: ClockIcon2,
      bar: 75,
    },
    {
      header: t("stats.breaksTaken"),
      title: stats.breaksTaken,
      subTitle: t("breakTime.breakSummary"),
      icon: BreakIcon,
      bar: 30,
    },
    {
      header: t("stats.totalOvertime"),
      title: stats.totalOvertime,
      subTitle: t("stats.extraHoursThisMonth"),
      icon: ClockIcon3,
      bar: 60,
      percentage: 1.3,
    },
  ];

  return (
    <section
      className="w-full min-h-[140px] flex justify-center items-stretch gap-6 p-6"
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
