import { TrendingUp, TrendingDown } from "lucide-react"
import Card from "../Time_Tracking_Components/Stats/Card"
import { useTranslation } from "react-i18next"

const AttendanceStats = () => {
  const { t } = useTranslation()

  const statsData = [
    {
      header: t("attendanceStats.totalDaysPresent"),
      title: "26",
      subTitle: t("attendanceStats.hoursWorked"),
      rightIcon: <img src="/assets/attendance_logs/logs.svg" alt="present" className="w-8 h-8" />,
      trend: {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        text: `1.3% ${t("attendanceStats.upFromMonth")}`,
        color: "text-green-600"
      }
    },
    {
      header: t("attendanceStats.totalDaysAbsent"),
      title: "4",
      subTitle: t("attendanceStats.breakToday"),
      rightIcon: <img src="/assets/attendance_logs/absent.svg" alt="absent" className="w-8 h-8" />,
      trend: {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        text: `4.3% ${t("attendanceStats.downFromMonth")}`,
        color: "text-red-600"
      }
    },
    {
      header: t("attendanceStats.lateArrivals"),
      title: "4",
      subTitle: t("attendanceStats.lateThisMonth"),
      rightIcon: <img src="/assets/attendance_logs/late.svg" alt="late" className="w-8 h-8" />,
      trend: {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        text: `4.3% ${t("attendanceStats.downFromMonth")}`,
        color: "text-red-600"
      }
    },
    {
      header: t("attendanceStats.averageClockIn"),
      title: `09:12 ${t("timeUnits.am")}`,
      subTitle: t("attendanceStats.basedOnMonth"),
      rightIcon: <img src="/assets/attendance_logs/avg.svg" alt="average" className="w-8 h-8" />,
      trend: {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        text: `1.3% ${t("attendanceStats.upFromMonth")}`,
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
  )
}

export default AttendanceStats
