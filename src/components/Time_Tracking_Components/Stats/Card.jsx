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
  bottomContent,
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
        {/* No background for top right icon */}
        {rightIcon && (
          <div className="w-8 h-8 flex items-center justify-center">
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
          {/* Gradient bg for bottom icon */}
          {footer && (
            <div
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
              style={{
                background: 'var(--hover-color)'
              }}
            >
              {footer}
            </div>
          )}
        </div>
      )}

      {/* Footer without progress bar */}
      {(!bar || bar === 0) && footer && (
        <div className="flex justify-end">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: 'var(--hover-color)',
            }}
          >
            {footer}
          </div>
        </div>
      )}

      {/* Button always at the end of the card */}
      {button && <div className="mt-3">{button}</div>}
      
      {/* Bottom Content */}
      {bottomContent && <div className="mt-3">{bottomContent}</div>}
    </div>
  );
};

export default Card;
