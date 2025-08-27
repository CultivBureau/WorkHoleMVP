import { TrendingUp, TrendingDown } from "lucide-react"
import Card from "../Time_Tracking_Components/Stats/Card"
import { useTranslation } from "react-i18next"
import { useGetStatsQuery } from "../../services/apis/AtteandanceApi"

const AttendanceStats = () => {
  const { t } = useTranslation()

  // Fetch stats from API
  const { data: stats, isLoading } = useGetStatsQuery({ page: 1, limit: 8 })

  const statsData = [
    {
      header: t("attendanceStats.totalDaysPresent"),
      title: isLoading ? "..." : (stats?.totalDaysPresent ?? 0),
      subTitle: t("attendanceStats.hoursWorked"),
      rightIcon: <img src="/assets/attendance_logs/logs.svg" alt="present" className="w-8 h-8" />,
      trend: {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        text: "", // You can add trend logic if you have it
        color: "text-green-600"
      }
    },
    {
      header: t("attendanceStats.totalDaysAbsent"),
      title: isLoading ? "..." : (stats?.totalDaysAbsent ?? 0),
      subTitle: t("attendanceStats.breakToday"),
      rightIcon: <img src="/assets/attendance_logs/absent.svg" alt="absent" className="w-8 h-8" />,
      trend: {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        text: "",
        color: "text-red-600"
      }
    },
    {
      header: t("attendanceStats.lateArrivals"),
      title: isLoading ? "..." : (stats?.lateArrivals ?? 0),
      subTitle: t("attendanceStats.lateThisMonth"),
      rightIcon: <img src="/assets/attendance_logs/late.svg" alt="late" className="w-8 h-8" />,
      trend: {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        text: "",
        color: "text-red-600"
      }
    },
    {
      header: t("attendanceStats.averageClockIn"),
      title: isLoading ? "..." : (stats?.avgClockIn ?? "--"),
      subTitle: t("attendanceStats.basedOnMonth"),
      rightIcon: <img src="/assets/attendance_logs/avg.svg" alt="average" className="w-8 h-8" />,
      trend: {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        text: "",
        color: "text-green-600"
      }
    },
  ]

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
            stat.trend.text && (
              <div className="flex items-center">
                {stat.trend.icon}
                <span className={`text-xs font-medium ${stat.trend.color}`}>
                  {stat.trend.text}
                </span>
              </div>
            )
          }
        />
      ))}
    </div>
  )
}

export default AttendanceStats
