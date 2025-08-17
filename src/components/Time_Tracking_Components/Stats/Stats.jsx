import React from "react";
import Card from "./Card";
import ClockIcon from "../../../../public/assets/dashboard_card/clock.svg";
import ClockIcon2 from "../../../../public/assets/dashboard_card/clock2.svg";
import ClockIcon3 from "../../../../public/assets/dashboard_card/clock3.svg";
import BreakIcon from "../../../../public/assets/dashboard_card/break.svg";

const Stats = () => {
  const Card_Data = [
    {
      header: "stats.daily_shift",
      title: "2:15:00",
      subTitle: "stats.hours_worked",
      icon: ClockIcon,
      bar: 45,
    },
    {
      header: "stats.this_week",
      title: "34:15:00",
      subTitle: "stats.total_hours_worked",
      icon: ClockIcon2,
      bar: 75,
    },
    {
      header: "stats.breaks_taken",
      title: "22m",
      subTitle: "stats.breaks_subtitle",
      icon: BreakIcon,
      bar: 30,
    },
    {
      header: "stats.total_overtime",
      title: "3h",
      subTitle: "stats.overtime_subtitle",
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
