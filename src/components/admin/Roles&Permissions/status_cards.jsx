import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../../Time_Tracking_Components/Stats/Card";

const StatusCards = () => {
    const { t } = useTranslation();

    const statusCards = [
        {
            header: "Total Roles",
            title: "26",
            subTitle: "All roles available in the system",
            rightIcon: <img src="/assets/RolesAndPermissions/total.svg" alt="Total Roles" className="w-6 h-6" />,
        },
        {
            header: "Active Roles",
            title: "26",
            subTitle: "Roles assigned to active users",
            rightIcon: <img src="/assets/RolesAndPermissions/active.svg" alt="Active Roles" className="w-6 h-6" />,
        },
        {
            header: "Custom Roles",
            title: "26",
            subTitle: "Created manually for specific needs",
            rightIcon: <img src="/assets/RolesAndPermissions/custom.svg" alt="Custom Roles" className="w-6 h-6" />,
        },
        {
            header: "Total Users",
            title: "26",
            subTitle: "All users in the system",
            rightIcon: <img src="/assets/RolesAndPermissions/totalusers.svg" alt="Total Users" className="w-6 h-6" />,
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