import WorkHoursCharts from "../WorkHoursChart/WorkHoursCharts"
import TimeFocusLogs from "../timerLogs/TimerLogs"
import MainContent from "../MainConent/MainContent"

const MainSection = () => {
  return (
    <div className="w-full h-max min-h-screen  p-6">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <MainContent />
          </div>

          {/* Right section - Charts and Logs */}
          <div className="lg:col-span-1 space-y-6">
            <WorkHoursCharts />
            <TimeFocusLogs />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainSection
