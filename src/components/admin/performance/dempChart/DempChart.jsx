import React from 'react'

const DempChart = () => {
    const DepartmentData = [
    {
    department : "Development",
    efficiency : 90,
   },
   {
    department : "Business",
    efficiency : 80,
   },
   {
    department : "Sales",
    efficiency : 75,
   },
   {
    department : "Marketing",
    efficiency : 85,
   },
   {
    department : "Development",
    efficiency : 90,
   },
   {
    department : "HR",
    efficiency : 80,
   },
    {
    department : "Finance",
    efficiency : 70,
   }, 
]
  return (
  <div className="w-full h-[500px] flex justify-center items-center bg-red-500">
         <div className="w-[70%] h-full bg-blue-600"></div>
        <div className="w-[30%] h-full bg-green-600"></div>
 </div>
  )
}

export default DempChart