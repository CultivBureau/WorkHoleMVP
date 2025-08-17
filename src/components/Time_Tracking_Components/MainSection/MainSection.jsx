import React from 'react'
import WorkHoursCharts from '../WorkHoursChart/WorkHoursCharts'
const MainSection = () => {
  return (
    <div className='w-full h-full pb-5 flex justify-center items-center bg-red-500'>
          <div className='w-[69%] h-full bg-green-500'></div>
          <div className='w-[31%] h-full bg-blue-500 flex justify-center items-center'>
            <WorkHoursCharts />
          </div>
    </div>
  )
}

export default MainSection
