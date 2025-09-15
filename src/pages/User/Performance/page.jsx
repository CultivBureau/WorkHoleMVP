import React from 'react'
import SideMenu from '../../../components/side-menu/side-menu'
import NavBar from '../../../components/NavBar/navbar'
import { useLang } from '../../../contexts/LangContext'
import { useTheme } from '../../../contexts/ThemeContext'
import Card from '../../../components/Time_Tracking_Components/Stats/Card'
import QuickActions from '../../../components/Performance/Quick-Actions/page'
import KpiBreakdown from '../../../components/Performance/kpi-Breakdown/page'
import KpiTrend from '../../../components/Performance/kpi-trend/page'
const Performance = () => {
    const { isRtl } = useLang();
    const { theme } = useTheme();
    const statusCardsData = [
        {
            header: 'My KPI Score',
            title: '82%',
            rightIcon: <img src="/assets/performance/kpi.svg" alt="performance" />
        },
        {
            header: 'Tasks Completed',
            title: '72%',
            rightIcon: <img src="/assets/performance/tasks.svg" alt="performance" />
        },
        {
            header: 'Attendance Rate',
            title: '92%',
            rightIcon: <img src="/assets/performance/rate.svg" alt="performance" />
        },
        {
            header: 'Hours Logged',
            title: '180h',
            rightIcon: <img src="/assets/performance/clock.svg" alt="performance" />
        },
    ]

    return (
        <div
            className="w-full h-screen flex flex-col"
            style={{ background: "var(--bg-all)" }}
        >
            {/* Navigation Bar - Full Width at Top */}
            <NavBar />

            {/* Content Area with SideMenu and Main Content */}
            <div className="flex flex-1 min-h-0" style={{ background: "var(--bg-all)" }}>
                {/* Side Menu - Left side under navbar */}
                <SideMenu />

                {/* Main Content - Rest of the space */}
                <main className="flex-1 overflow-auto p-4" style={{ background: "var(--bg-all)" }}>
                    <div
                        className="h-max rounded-2xl border border-gray-200"
                        style={{ background: "var(--bg-color)" }}
                    >
                        {/* Performance content */}
                        <div className="w-full h-max pr-2 pl-2">
                            <div className='w-full h-max flex justify-center items-center gap-5 pb-1 pt-3'>
                                {statusCardsData.map((card, index) => (
                                    <Card
                                        key={index}
                                        header={card.header}
                                        title={card.title}
                                        rightIcon={card.rightIcon}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                            <div className='w-full h-max flex justify-center items-center '>
                                 <div className='w-[75%] h-max  flex justify-center items-center flex-col'>
                                    <QuickActions/>
                                    <KpiTrend/>
                                 </div>
                                 <div className='w-[25%] h-max flex justify-center items-center '>
                                    <KpiBreakdown/>
                                 </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Performance