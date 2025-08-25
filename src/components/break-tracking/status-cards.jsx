import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../Time_Tracking_Components/Stats/Card";
import { useTranslation } from "react-i18next";

const AttendanceStats = () => {
  const { t, i18n } = useTranslation();

  // Example: get most used break type dynamically, fallback to "prayer"
  const mostUsedBreakType = "prayer"; // Replace with your dynamic value if available

  const statsData = [
    {
      header: t("breakStats.todaysBreakTime"),
      title: "13m",
      subTitle: t("breakStats.timeTakenToday"),
      rightIcon: (
        <img
          src="/assets/break_tracking/break-time.svg"
          alt="present"
          className="w-8 h-8"
        />
      ),
      trend: {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        text: `1.3% ${t("attendanceStats.upFromMonth")}`,
        color: "text-green-600",
      },
    },
    {
      header: t("breakStats.mostUsedBreak"),
      title: t(`breakTime.reasons.${mostUsedBreakType}`),
      subTitle: t("breakStats.mostCommonThisWeek", "Most common this week"),
      rightIcon: (
        <img
          src="/assets/break_tracking/most-break.svg"
          alt="absent"
          className="w-8 h-8"
        />
      ),
      trend: {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        text: `4.3% ${t("attendanceStats.downFromMonth")}`,
        color: "text-red-600",
      },
    },
    {
      header: t("breakStats.avgBreakPerDay", "Avg. Break per Day"),
      title: "00:22",
      subTitle: t("breakStats.basedOnLast7Days", "Based on last 7 days"),
      rightIcon: (
        <img
          src="/assets/break_tracking/avg-break.svg"
          alt="late"
          className="w-8 h-8"
        />
      ),
      trend: {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        text: `4.3% ${t("attendanceStats.downFromMonth")}`,
        color: "text-red-600",
      },
    },
    {
      header: t("breakStats.breaksOverLimit", "Breaks Over Limit"),
      title: "2",
      subTitle: t(
        "breakStats.exceededLimit",
        "You exceeded 30m limit this week"
      ),
      rightIcon: (
        <img
          src="/assets/break_tracking/overlimit.svg"
          alt="average"
          className="w-8 h-8"
        />
      ),
      trend: {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        text: `1.3% ${t("attendanceStats.upFromMonth")}`,
        color: "text-green-600",
      },
    },
  ];

  return (
    <div className="w-full h-[22vh] flex justify-center items-stretch gap-6 mb-6">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          header={stat.header}
          title={stat.title}
          subTitle={stat.subTitle}
          rightIcon={stat.rightIcon}
          className="h-full"
          bottomContent={
            <div className="flex items-center">
              {stat.trend.icon}
              <span className={`text-xs font-medium ${stat.trend.color}`}>
                {stat.trend.text}
              </span>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default AttendanceStats;
