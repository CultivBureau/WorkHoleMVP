import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../../Time_Tracking_Components/Stats/Card";

const StatusCards = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const statusCards = [
        {
            header: t('roles.statusCards.totalRoles'),
            title: "26",
            subTitle: t('roles.statusCards.allRolesAvailable'),
            rightIcon: <img src="/assets/RolesAndPermissions/total.svg" alt={t('roles.statusCards.totalRoles')} className="w-6 h-6" />,
        },
        {
            header: t('roles.statusCards.activeRoles'),
            title: "26",
            subTitle: t('roles.statusCards.rolesAssignedToActive'),
            rightIcon: <img src="/assets/RolesAndPermissions/active.svg" alt={t('roles.statusCards.activeRoles')} className="w-6 h-6" />,
        },
        {
            header: t('roles.statusCards.customRoles'),
            title: "26",
            subTitle: t('roles.statusCards.createdManually'),
            rightIcon: <img src="/assets/RolesAndPermissions/custom.svg" alt={t('roles.statusCards.customRoles')} className="w-6 h-6" />,
        },
        {
            header: t('roles.statusCards.totalUsers'),
            title: "26",
            subTitle: t('roles.statusCards.allUsersInSystem'),
            rightIcon: <img src="/assets/RolesAndPermissions/totalusers.svg" alt={t('roles.statusCards.totalUsers')} className="w-6 h-6" />,
        },
    ];

    return (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
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