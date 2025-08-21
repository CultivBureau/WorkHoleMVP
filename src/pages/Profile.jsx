import { useTranslation } from "react-i18next"
import HeaderSection from "../components/profile/header-section"
import PersonalInfo from "../components/profile/personal-info"

const Profile = () => {
    const { i18n } = useTranslation()
    return (
        <div dir={i18n.dir()}>
            <HeaderSection />
            <PersonalInfo />
        </div>
    )
}

export default Profile