import React from "react";
import { TrendingUp } from "lucide-react";

const Card = ({ header, title, subTitle, icon , bar, percentage }) => {
  return (
    <div
      className="w-[280px] h-max pb-5  min-h-[168px] flex flex-col justify-between p-6 pl-[15px] pt-[10px] rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Header and Icon */}
      <div className="w-full h-max  flex justify-between items-center">
        <h3
          className="text-sm font-medium leading-tight"
          style={{ color: "var(--sub-text-color)" }}
        >
          {header}
        </h3>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--hover-color)" }}
        >
          <img src={icon} className="w-6 h-6" style={{ color: "var(--accent-color)" }} />
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="w-full h-max flex flex-col gap-2 justify-center items-start">
        <h2
          className="text-2xl font-bold leading-none"
          style={{ color: "var(--text-color)" }}
        >
          {title}
        </h2>
        <div className="flex flex-col gap-1">
          <p
            className="text-sm font-medium leading-tight"
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
        className="w-full h-2 rounded-full overflow-hidden"
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
