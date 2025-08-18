import React from "react";

const Card = ({
  header,
  title,
  subTitle,
  icon,
  bar,
  percentage,
  button,
  rightIcon,
  statusDot,
  footer,
  children,
}) => {
  return (
    <div
      className="w-full min-h-[170px] flex flex-col justify-between p-4 rounded-2xl border shadow-sm"
      style={{
        backgroundColor: 'var(--bg-color)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="text-xs font-medium" style={{ color: 'var(--sub-text-color)' }}>
            {header}
          </h3>
          {statusDot}
        </div>
        {rightIcon && (
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--hover-color)' }}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center mb-3">
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-color)' }}>
          {title}
        </h2>
        <p className="text-xs mb-2" style={{ color: 'var(--sub-text-color)' }}>
          {subTitle}
        </p>
        {children}
        {button && <div className="mt-2">{button}</div>}
      </div>

      {/* Progress Bar */}
      {typeof bar === "number" && bar > 0 && (
        <div className="flex items-center gap-2">
          <div 
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--container-color)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                width: `${bar}%`,
                transition: "width 0.5s ease-out",
              }}
            />
          </div>
          {footer && <div className="flex-shrink-0">{footer}</div>}
        </div>
      )}

      {/* Footer without progress bar */}
      {(!bar || bar === 0) && footer && (
        <div className="flex justify-end">{footer}</div>
      )}
    </div>
  );
};

export default Card;

// Example Usage:
// <Card
//   header="My Card"
//   title="Some Value"
//   subTitle="Some Subtitle"
//   icon="/assets/myicon.svg"
//   bar={60}
//   percentage={12}
//   button={<button className="btn">Click Me</button>}
//   footer={<div>Custom Footer</div>}
// >
/* Any custom content here */
// </Card>
