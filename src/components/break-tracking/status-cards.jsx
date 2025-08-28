import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../Time_Tracking_Components/Stats/Card";
import { useTranslation } from "react-i18next";
import { useGetBreakDashboardQuery } from "../../services/apis/BreakApi";

const AttendanceStats = () => {
  const { t } = useTranslation();
  const { data: dashboard, isLoading } = useGetBreakDashboardQuery();

  // Dynamic values from backend
  const todaysBreakTime = dashboard?.todaysBreakTime || "--";
  const mostUsedBreakType = dashboard?.mostUsedBreak || "--";
  const avgBreakPerDay = dashboard?.avgBreakPerDay || "--";
  const breaksOverLimit = dashboard?.breaksOverLimit ?? "--";

  const statsData = [
    {
      header: t("breakStats.todaysBreakTime"),
      title: todaysBreakTime,
      subTitle: t("breakStats.timeTakenToday"),
      rightIcon: (
        <img
          src="/assets/break_tracking/break-time.svg"
          alt="present"
          className="w-8 h-8 drop-shadow-lg"
        />
      ),
    },
    {
      header: t("breakStats.mostUsedBreak"),
      title: t(`breakTime.reasons.${mostUsedBreakType}`, mostUsedBreakType),
      subTitle: t("breakStats.mostCommonThisWeek", "Most common this week"),
      rightIcon: (
        <img
          src="/assets/break_tracking/most-break.svg"
          alt="absent"
          className="w-8 h-8 drop-shadow-lg"
        />
      ),
    },
    {
      header: t("breakStats.avgBreakPerDay", "Avg. Break per Day"),
      title: avgBreakPerDay,
      subTitle: t("breakStats.basedOnLast7Days", "Based on last 7 days"),
      rightIcon: (
        <img
          src="/assets/break_tracking/avg-break.svg"
          alt="late"
          className="w-8 h-8 drop-shadow-lg"
        />
      ),
    },
    {
      header: t("breakStats.breaksOverLimit", "Breaks Over Limit"),
      title: breaksOverLimit,
      subTitle: t(
        "breakStats.exceededLimit",
        "You exceeded 30m limit this week"
      ),
      rightIcon: (
        <img
          src="/assets/break_tracking/overlimit.svg"
          alt="average"
          className="w-8 h-8 drop-shadow-lg"
        />
      ),
    },
  ];

  return (
    <div className="w-full h-[22vh] flex justify-center items-stretch gap-6 mb-6">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          header={stat.header}
          title={isLoading ? (
            <div className="animate-pulse bg-gray-300 h-6 w-16 rounded"></div>
          ) : (
            <span>
              {stat.title}
            </span>
          )}
          subTitle={stat.subTitle}
          rightIcon={stat.rightIcon}
          className="h-full backdrop-blur-sm border border-opacity-20"
          style={{
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08), 0 4px 15px rgba(0, 0, 0, 0.05)',
            borderColor: 'var(--border-color)',
            background: 'linear-gradient(135deg, var(--bg-color), rgba(255, 255, 255, 0.02))'
          }}
        />
      ))}
    </div>
  );
};

export default AttendanceStats;
