import React from 'react';
import DepartmentCard from './Card';

const Departments = () => {
  // Sample department data
  const departments = [
    {
      id: 1,
      departmentName: "Department Development",
      memberCount: 20,
      presentCount: 18,
      absentCount: 2,
      percentage: 94.6
    },
    {
      id: 2,
      departmentName: "Department Development",
      memberCount: 20,
      presentCount: 18,
      absentCount: 2,
      percentage: 94.6
    },
    {
      id: 3,
      departmentName: "Department Development",
      memberCount: 20,
      presentCount: 18,
      absentCount: 2,
      percentage: 94.6
    },
    {
      id: 4,
      departmentName: "Department Development",
      memberCount: 20,
      presentCount: 18,
      absentCount: 2,
      percentage: 94.6
    }
  ];

  return (
    <div className="w-full h-max flex justify-center items-center shadow-2xl border border-[var(--border-color)] rounded-[22px] p-2 flex-col">
        <div className='w-full h-max flex pb-2 pl-2 pt-1 justify-center items-center'>
            <h1 className='w-[80%] h-max text-start text-[12px] text-[var(--text-color)] font-medium transition-colors duration-200'>
                Departments Overview
            </h1>
            <button className='w-[20%] h-max p-1 flex gradient-text mr-2 border border-[var(--border-color)] rounded-[8px] text-[11px] justify-center items-center  transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] hover:border-[var(--accent-color)] hover:bg-[var(--hover-color)] active:scale-[0.98] active:shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-opacity-50'>
                View All
            </button>
        </div>
        {departments.slice(0, 4).map((dept) => (
            <DepartmentCard
              key={dept.id}
              departmentName={dept.departmentName}
              memberCount={dept.memberCount}
              presentCount={dept.presentCount}
              absentCount={dept.absentCount}
              percentage={dept.percentage}
            />
          ))}

    </div>
  );
};

export default Departments;
