import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../../Time_Tracking_Components/Stats/Card";

const StatusCards = () => {
    const { t } = useTranslation();

    const statusCards = [
        {
            header: t("allDepartments.statusCards.totalDepartments.title"),
            title: t("allDepartments.statusCards.totalDepartments.count"),
            subTitle: t("allDepartments.statusCards.totalDepartments.description"),
            rightIcon: <img src="/assets/all-department/total.svg" alt="Total Departments" className="w-6 h-6" />,
        },
        {
            header: t("allDepartments.statusCards.highestDepartment.title"),
            title: t("allDepartments.statusCards.highestDepartment.name"),
            subTitle: t("allDepartments.statusCards.highestDepartment.description"),
            rightIcon: <img src="/assets/all-department/highest.svg" alt="Highest Department" className="w-6 h-6" />,
        },
        {
            header: t("allDepartments.statusCards.employeesDepartment.title"),
            title: t("allDepartments.statusCards.employeesDepartment.count"),
            subTitle: t("allDepartments.statusCards.employeesDepartment.description"),
            rightIcon: <img src="/assets/all-department/employees.svg" alt="Employees Department" className="w-6 h-6" />,
        },
        {
            header: t("allDepartments.statusCards.departmentsIssues.title"),
            title: t("allDepartments.statusCards.departmentsIssues.count"),
            subTitle: t("allDepartments.statusCards.departmentsIssues.description"),
            rightIcon: <img src="/assets/all-department/issues.svg" alt="Departments Issues" className="w-6 h-6" />,
        },
    ];

    return (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

export default StatusCards;