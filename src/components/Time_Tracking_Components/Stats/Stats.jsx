import React, { useEffect, useState, useRef } from "react";
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
  const [activeWorkSeconds, setActiveWorkSeconds] = useState(0);
  const timerRef = useRef(null);

  // fallback لو البيانات مش موجودة
  const stats = data || {
    thisWeek: "0h 0m",
    breaksTaken: "0h 0m",
    totalOvertime: "0h 0m",
    currentStatus: "Clocked Out",
    clockInTime: null,
    dailyShift: "0h 0m",
  };

  // احسب وقت البداية من الـ backend لو موجود
  const clockInTime = stats.clockInTime; // لازم backend يرجع clockInTime بصيغة ISO

  // شغل التايمر لو المستخدم Clocked In
  useEffect(() => {
    if (stats.currentStatus === "Clocked In" && clockInTime) {
      const start = new Date(clockInTime);
      const updateTimer = () => {
        const now = new Date();
        const diff = Math.floor((now - start) / 1000);
        setActiveWorkSeconds(diff);
      };
      updateTimer();
      timerRef.current = setInterval(updateTimer, 60 * 1000); // يحدث كل دقيقة
      return () => clearInterval(timerRef.current);
    } else {
      setActiveWorkSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [stats.currentStatus, clockInTime]);

  // دالة لتحويل الثواني إلى "xh ym"
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // احسب dailyShift ديناميكي لو المستخدم Clocked In
  const dynamicDailyShift = stats.currentStatus === "Clocked In" && clockInTime
    ? formatTime(activeWorkSeconds)
    : stats.dailyShift;

  // دالة لتحويل "3h 30m" أو "16m" أو "2h" إلى دقائق
  function parseTimeString(str) {
    const hMatch = str.match(/(\d+)h/);
    const mMatch = str.match(/(\d+)m/);
    const hours = hMatch ? parseInt(hMatch[1]) : 0;
    const minutes = mMatch ? parseInt(mMatch[1]) : 0;
    return hours * 60 + minutes;
  }

  // احسب thisWeek ديناميكي (أضف وقت اليوم الحالي لو المستخدم Clocked In)
  const weekMinutes = (() => {
    const weekBase = parseTimeString(stats.thisWeek);
    const todayMinutes = stats.currentStatus === "Clocked In" && clockInTime
      ? Math.floor(activeWorkSeconds / 60)
      : 0;
    return weekBase + todayMinutes;
  })();
  const dynamicThisWeek = `${Math.floor(weekMinutes / 60)}h ${weekMinutes % 60}m`;

  const Card_Data = [
    {
      header: t("stats.thisWeek"),
      title: dynamicThisWeek,
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
