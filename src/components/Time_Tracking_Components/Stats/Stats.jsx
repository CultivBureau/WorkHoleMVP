import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import WorkedIcon from "../../../../public/assets/time_tracking/worked.svg";
import BreakIcon from "../../../../public/assets/time_tracking/break-icon.svg";
import OvertimeIcon from "../../../../public/assets/time_tracking/overtime.svg";
import { useTranslation } from "react-i18next";
import TimerCard from "./TimerCard";
import { useGetDashboardQuery } from "../../../services/apis/AtteandanceApi";

const Stats = () => {
  const { t } = useTranslation();
  const { data } = useGetDashboardQuery({});
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
      rightIcon: <img src={WorkedIcon} alt="Worked" />,
      bar: 75,
    },
    {
      header: t("stats.breaksTaken"),
      title: stats.breaksTaken,
      subTitle: t("breakTime.breakSummary"),
      rightIcon: <img src={BreakIcon} alt="Break" />,
      bar: 30,
    },
    {
      header: t("stats.totalOvertime"),
      title: stats.totalOvertime,
      subTitle: t("stats.extraHoursThisMonth"),
      rightIcon: <img src={OvertimeIcon} alt="Overtime" />,
      bar: 60,
      percentage: 1.3,
    },
  ];

  return (
    <section
      className="w-full rounded-2xl min-h-[140px] flex flex-col max-[1200px]:flex-wrap sm:flex-row justify-center items-stretch gap-4 sm:gap-6 p-4 sm:p-6"
      style={{ backgroundColor: "var(--bg-color)" }}
    >
     
      {Card_Data.map((card, index) => (
        <Card key={index} {...card} className="h-full" />
      ))}
       <TimerCard />
    </section>
  );
};

export default Stats;
