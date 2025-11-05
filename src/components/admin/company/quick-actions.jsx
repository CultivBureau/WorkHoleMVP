import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: "Manage Breaks",
      description: "Configure break policies and schedules",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => navigate("/admin/break-tracking"),
      color: "#15919B"
    },
    {
      id: 2,
      title: "Policy Settings",
      description: "Update company policies and rules",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: () => console.log("Navigate to Policy Settings"),
      color: "#09D1C7"
    },
    {
      id: 3,
      title: "Shift Management",
      description: "Organize shifts and schedules",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      action: () => console.log("Navigate to Shift Management"),
      color: "#5EC6C6"
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: "var(--bg-color)",
              border: "2px solid var(--border-color)",
            }}
          >
            {/* Gradient overlay on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${action.color}, ${action.color})`
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon Container */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `${action.color}20`
                }}
              >
                <div style={{ color: action.color }}>
                  {action.icon}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 text-left min-w-0">
                <h3 
                  className="text-lg font-bold mb-1 transition-colors duration-300"
                  style={{ color: "var(--text-color)" }}
                >
                  {action.title}
                </h3>
                <p 
                  className="text-sm transition-colors duration-300 line-clamp-2"
                  style={{ color: "var(--sub-text-color)" }}
                >
                  {action.description}
                </p>
              </div>

              {/* Arrow Icon */}
              <div 
                className="hidden sm:block transition-all duration-300 group-hover:translate-x-2 flex-shrink-0"
                style={{ color: action.color }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Bottom indicator line */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ background: action.color }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
