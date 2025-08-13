"use client"
import Card from "../Time_Tracking_Components/Stats/Card"

const translations = {
  en: {
    status: "Status",
    notClockedIn: "Not Clocked in",
    goToTimeTracker: "Go to Time Tracker",
    leaveRequest: "Leave Request",
    noLeaveRequest: "No Leave Request",
    noRequestText: "You haven't requested any leave for this month",
    dailyShift: "Daily Shift",
    hoursWorked: "Hours Worked",
    performance: "Performance",
    tasksCompleted: "Tasks completed this week",
  },
  ar: {
    status: "الحالة",
    notClockedIn: "لم يتم تسجيل الدخول",
    goToTimeTracker: "اذهب إلى متتبع الوقت",
    leaveRequest: "طلب إجازة",
    noLeaveRequest: "لا يوجد طلب إجازة",
    noRequestText: "لم تطلب أي إجازة لهذا الشهر",
    dailyShift: "الوردية اليومية",
    hoursWorked: "ساعات العمل",
    performance: "الأداء",
    tasksCompleted: "المهام المكتملة هذا الأسبوع",
  },
}

export default function StatusCards({ lang }) {
  const t = translations[lang]

  const cardsData = [
    {
      header: t.status,
      title: t.notClockedIn,
      subTitle: t.goToTimeTracker,
      icon: "/assets/dashboard_card/status.svg",
      bar: 0,
      percentage: null
    },
    {
      header: t.leaveRequest,
      title: t.noLeaveRequest,
      subTitle: t.noRequestText,
      icon: "/assets/dashboard_card/clock.svg",
      bar: 0,
      percentage: null
    },
    {
      header: t.dailyShift,
      title: "2:15:00",
      subTitle: t.hoursWorked,
      icon: "/assets/dashboard_card/clock2.svg",
      bar: 35,
      percentage: null
    },
    {
      header: t.performance,
      title: "75%",
      subTitle: t.tasksCompleted,
      icon: "/assets/dashboard_card/performance.svg",
      bar: 75,
      percentage: 12
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          header={card.header}
          title={card.title}
          subTitle={card.subTitle}
          icon={card.icon}
          bar={card.bar}
          percentage={card.percentage}
        />
      ))}
    </div>
  )
}
