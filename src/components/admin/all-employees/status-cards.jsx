import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../../Time_Tracking_Components/Stats/Card";

const StatusCards = () => {
    const { t } = useTranslation();

    const statusCards = [
        {
            header: t("employees.totalEmployees", "Total Employees"),
            title: "98",
            subTitle: t("employees.activeStaffMembers", "Active staff members"),
            rightIcon: <img src="/assets/all_employees/employees.svg" alt="Total Employees" className="w-6 h-6" />,
        },
        {
            header: t("employees.newHires", "New Hires"),
            title: "5",
            subTitle: t("employees.joinedThisMonth", "Joined this month"),
            rightIcon: <img src="/assets/all_employees/new.svg" alt="New Hires" className="w-6 h-6" />,
        },
        {
            header: t("employees.maleEmployees", "Male Employees"),
            title: "50",
            subTitle: t("employees.activeMaleEmployees", "Active male employees"),
            rightIcon: <img src="/assets/all_employees/male.svg" alt="Male Employees" className="w-6 h-6" />,
        },
        {
            header: t("employees.femaleEmployees", "Female Employees"),
            title: "48",
            subTitle: t("employees.activeFemaleEmployees", "Active female employees"),
            rightIcon: <img src="/assets/all_employees/female.svg" alt="Female Employees" className="w-6 h-6" />,
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
                >
                </Card>
            ))}
        </section>
    );
};

export default StatusCards;