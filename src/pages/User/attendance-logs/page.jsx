import React from "react";
import SideMenu from "../../../components/side-menu/side-menu";
import NavBar from "../../../components/NavBar/navbar";
import AttendanceStates from "../../../components/attendance-logs/AttendanceStats";
import AttendanceTable from "../../../components/attendance-logs/AttendanceTable";
import Loading from "../../../components/Loading/Loading";
import { useGetStatsQuery } from "../../../services/apis/AtteandanceApi";
import { useLang } from "../../../contexts/LangContext";

const AttendanceLogs = () => {
    const { isRtl } = useLang();
    
    // Check loading state from the main API query used by components
    const { isLoading } = useGetStatsQuery({ page: 1, limit: 8 });

    // Show loading screen while data is being fetched
    if (isLoading) {
        return <Loading />;
    }

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
                        {/* Attendance Logs content */}
                        <div className="w-full h-max p-6"> 
                            {/* Attendance Stats */}
                            <AttendanceStates />
                            
                            {/* Attendance Table */}
                            <AttendanceTable />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AttendanceLogs;