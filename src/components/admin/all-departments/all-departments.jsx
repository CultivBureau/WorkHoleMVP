import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import DepartmentCard from "./department-card";

export default function AllDepartments() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleAddNewDepartment = () => {
        navigate('/pages/admin/new-department');
    };



    // Mock departments data
    const departmentsData = [
        {
            id: 1,
            name: "Design Department",
            totalMembers: 15,
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            teams: [
                { name: "UX Team", description: "User Experience", memberCount: 5 },
                { name: "UI Team", description: "User Interface", memberCount: 4 },
                { name: "Graphic Design", description: "Visual Design", memberCount: 3 },
                { name: "UX Writing", description: "Content Design", memberCount: 3 }
            ]
        },
        {
            id: 2,
            name: "Sales Department",
            totalMembers: 18,
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            teams: [
                { name: "Inside Sales", description: "Internal Sales Team", memberCount: 6 },
                { name: "Field Sales", description: "External Sales Representatives", memberCount: 5 },
                { name: "Sales Support", description: "Sales Operations & Support", memberCount: 4 },
                { name: "Business Development", description: "New Business Opportunities", memberCount: 3 }
            ]
        },
        {
            id: 3,
            name: "Project Manager Department",
            totalMembers: 12,
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            teams: [
                { name: "Agile Team", description: "Scrum & Agile Management", memberCount: 4 },
                { name: "Waterfall Team", description: "Traditional Project Management", memberCount: 4 },
                { name: "PMO Team", description: "Project Management Office", memberCount: 4 }
            ]
        },
        {
            id: 4,
            name: "Marketing Department",
            totalMembers: 14,
            memberAvatars: [
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png",
                "/assets/navbar/Avatar.png"
            ],
            teams: [
                { name: "Digital Marketing", description: "Online Marketing & SEO", memberCount: 6 },
                { name: "Content Marketing", description: "Content Creation & Strategy", memberCount: 4 },
                { name: "Brand Marketing", description: "Brand Management & PR", memberCount: 4 }
            ]
        }
    ];

    // Filter departments based on search term
    const filteredDepartments = departmentsData.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.teams.some(team => 
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
            {/* Search and Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search
                        className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 ${isArabic ? 'right-3' : 'left-3'}`}
                        style={{ color: 'var(--sub-text-color)' }}
                    />
                    <input
                        type="text"
                        placeholder={t("allDepartments.search.placeholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                        style={{
                            borderColor: 'var(--border-color)',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-color)',
                            paddingLeft: isArabic ? '16px' : '40px',
                            paddingRight: isArabic ? '40px' : '16px',
                            focusRingColor: 'var(--accent-color)',
                            textAlign: isArabic ? 'right' : 'left'
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div className={` ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <button 
                        onClick={handleAddNewDepartment}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">{t("allDepartments.search.addNewDepartment")}</span>
                    </button>
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDepartments.length > 0 ? (
                    filteredDepartments.map((department) => (
                        <DepartmentCard key={department.id} department={department} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-[var(--container-color)] rounded-full flex items-center justify-center mb-4">
                            <Search className="text-[var(--sub-text-color)]" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-color)] mb-2">
                            No departments found
                        </h3>
                        <p className="text-[var(--sub-text-color)] max-w-sm">
                            {searchTerm 
                                ? `No departments match "${searchTerm}". Try adjusting your search.`
                                : "No departments available at the moment."
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            {searchTerm && filteredDepartments.length > 0 && (
                <div className={`text-sm text-[var(--sub-text-color)] ${isArabic ? 'text-right' : 'text-left'}`}>
                    Showing {filteredDepartments.length} of {departmentsData.length} departments
                </div>
            )}
        </div>
    );
}
