import React from "react";
import { TrendingUp } from "lucide-react";

const Card = ({ header, title, subTitle, icon, bar, percentage }) => {
  return (
    <div
      className="w-full h-[180px] flex flex-col justify-between p-4 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Header and Icon */}
      <div className="w-full flex justify-between items-center">
        <h3
          className="text-xs font-medium"
          style={{ color: "var(--sub-text-color)" }}
        >
          {header}
        </h3>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--hover-color)" }}
        >
          <img src={icon} className="w-4 h-4" alt={header} />
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="w-full flex flex-col gap-1 flex-1 justify-center">
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--text-color)" }}
        >
          {title}
        </h2>
        <div className="flex flex-col gap-1">
          <p
            className="text-xs"
            style={{ color: "var(--sub-text-color)" }}
          >
            {subTitle}
          </p>
          {percentage && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp
                className="w-3 h-3"
                style={{ color: "var(--accent-color)" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--accent-color)" }}
              >
                {percentage}% Up from Month
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border-color)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            background:
              "linear-gradient(90deg, var(--gradient-start), var(--gradient-end))",
            width: `${bar}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Card;
