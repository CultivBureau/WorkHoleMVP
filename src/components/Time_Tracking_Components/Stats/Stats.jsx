import React from "react";
import Card from "./Card";
import { Clock, Calendar, Coffee, TrendingUp } from "lucide-react";
import ClockIcon from "../../../../public/assets/dashboard_card/clock.svg";
import ClockIcon2 from "../../../../public/assets/dashboard_card/clock2.svg";
import ClockIcon3 from "../../../../public/assets/dashboard_card/clock3.svg";
import BreakIcon from "../../../../public/assets/dashboard_card/break.svg";

const Stats = () => {
  const Card_Data = [
    {
      header: "Daily shift",
      title: "2:15:00",
      subTitle: "Hours Worked",
      icon: ClockIcon,
      bar: 45,
    },
    {
      header: "This Week",
      title: "34:15:00",
      subTitle: "Total Hours Worked",
      icon: ClockIcon2,
      bar: 75,
    },
    {
      header: "Breaks Taken",
      title: "22m",
      subTitle: "You've taken this much break today",
      icon: BreakIcon,
      bar: 30,
    },
    {
      header: "Total Overtime",
      title: "3h",
      subTitle: "This month's extra hours worked",
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
