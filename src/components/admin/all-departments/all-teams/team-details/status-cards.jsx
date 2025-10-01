import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../../../../Time_Tracking_Components/Stats/Card";

const TeamDetailsStatusCards = ({ teamData }) => {
    const { t } = useTranslation();

    // Default values if no team data is provided
    const defaultTeamData = {
        kpiScore: 78,
        tasksCompleted: 95,
        tasksTotal: 120,
        attendanceRate: 92,
        topPerformer: {
            name: "Ahmed Ali",
            percentage: 92
        }
    };

    const data = teamData || defaultTeamData;

    const statusCards = [
        {
            header: t('teamDetails.statusCards.teamKpiScore'),
            title: `${data.kpiScore}%`,
            subTitle: t('teamDetails.statusCards.overallPerformance'),
            rightIcon: <img src="/assets/all-department/teams/team-details/kpis.svg" alt="KPI Score" className="w-6 h-6" />,
        },
        {
            header: t('teamDetails.statusCards.tasksProgress'),
            title: `${data.tasksCompleted} / ${data.tasksTotal}`,
            subTitle: t('teamDetails.statusCards.completedVsAssigned'),
            rightIcon: <img src="/assets/all-department/teams/team-details/progress.svg" alt="Tasks Progress" className="w-6 h-6" />,
        },
        {
            header: t('teamDetails.statusCards.averageAttendance'),
            title: `${data.attendanceRate}%`,
            subTitle: t('teamDetails.statusCards.presenceRate'),
            rightIcon: <img src="/assets/all-department/teams/team-details/attendance.svg" alt="Attendance" className="w-6 h-6" />,
        },
        {
            header: t('teamDetails.statusCards.topPerformer'),
            title: `${data.topPerformer.name} (${data.topPerformer.percentage}%)`,
            subTitle: t('teamDetails.statusCards.bestPerforming'),
            rightIcon: <img src="/assets/all-department/teams/team-details/performer.svg" alt="Top Performer" className="w-6 h-6" />,
        },
    ];

    return (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ minHeight: 'auto' }}>
            {statusCards.map((card, index) => (
                <Card
                    key={index}
                    header={card.header}
                    title={card.title}
                    subTitle={card.subTitle}
                    rightIcon={card.rightIcon}
                    className="min-h-[120px]"
                />
            ))}
        </section>
    );
};

export default TeamDetailsStatusCards;
