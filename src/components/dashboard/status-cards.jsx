"use client"
import { useTranslation } from "react-i18next";
import Card from "../Time_Tracking_Components/Stats/Card";

export default function StatusCards() {
  const { t } = useTranslation();

  // Icons with accent color
  const CalendarIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent-color)' }}>
      <path d="M8 2v3m8-3v3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ClockIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent-color)' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const PerformanceIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent-color)' }}>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M20 8v6M23 11l-3-3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const LeaveIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent-color)' }}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Bar chart icon
  const BarChartIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent-color)' }}>
      <line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="20" x2="18" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="20" x2="6" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Red status dot using error color
  const RedDot = (
    <span
      className="inline-block w-2 h-2 rounded-full ml-2"
      style={{ backgroundColor: 'var(--error-color)' }}
    ></span>
  );

  // Gradient button using CSS variables
  const GoToTimeTrackerBtn = (
    <button
      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-white font-medium text-xs shadow-sm hover:shadow-md transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))'
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Go To Time Tracker
    </button>
  );

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5"
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      {/* Status Card */}
      <Card
        header="Status"
        title="Not Clocked In"
        subTitle="Click Below to start tracking"
        statusDot={RedDot}
        rightIcon={CalendarIcon}
        button={GoToTimeTrackerBtn}
      />

      {/* Leave Request Card */}
      <Card
        header="Leave Request"
        title="No Leave Request"
        subTitle="You haven't requested any leave."
        rightIcon={LeaveIcon}
        footer={BarChartIcon}
      />

      {/* Daily Shift Card */}
      <Card
        header="Daily shift"
        title="2:15:00"
        subTitle="Hours Worked"
        rightIcon={ClockIcon}
        bar={45}
        footer={BarChartIcon}
      />

      {/* Performance Card */}
      <Card
        header="Performance"
        title="75%"
        subTitle="Tasks completed this week"
        rightIcon={PerformanceIcon}
        bar={75}
        footer={BarChartIcon}
      />
    </div>
  );
}
