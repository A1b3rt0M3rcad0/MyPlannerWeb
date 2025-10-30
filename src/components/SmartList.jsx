import React from "react";

// Reusable list row component inspired by Accounts list styling
// Props:
// - items: Array<{
//     id: string|number,
//     title: string,
//     subtitle?: string,
//     leftColor?: string, // hex or rgba for left icon background border accents
//     leftIcon?: React.ReactNode,
//     badge?: { label: string, bgClass?: string, textClass?: string, ringClass?: string },
//     rightValue?: React.ReactNode,
//     actions?: Array<{ key: string, title: string, icon: React.ReactNode, onClick: () => void, className?: string }>,
//   }>
// - className?: container extra classes
export default function SmartList({ items = [], className = "" }) {
  return (
    <div className={`divide-y divide-white/10 ${className}`}>
      {items.map((item) => {
        const leftBg = item.leftColor ? `${item.leftColor}20` : undefined;
        const leftBorder = item.leftColor ? `${item.leftColor}50` : undefined;

        return (
          <div
            key={item.id}
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 px-4 py-3"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{ backgroundColor: leftBg, borderColor: leftBorder }}
              >
                {item.leftIcon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {item.title}
                  </p>
                  {item.badge ? (
                    <span
                      className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        item.badge.bgClass || "bg-white/10"
                      } ${item.badge.textClass || "text-gray-300"} ${
                        item.badge.ringClass || ""
                      }`}
                      title={item.badge.label}
                    >
                      {item.badge.label}
                    </span>
                  ) : null}
                </div>
                {item.subtitle ? (
                  <p className="text-xs text-gray-400 truncate">
                    {item.subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.rightValue ? (
                <span className="text-sm font-semibold text-white/90">
                  {item.rightValue}
                </span>
              ) : null}
              {Array.isArray(item.actions)
                ? item.actions.map((act) => (
                    <button
                      key={act.key}
                      type="button"
                      onClick={act.onClick}
                      className={
                        act.className ||
                        "p-2 rounded-lg border border-white/10 text-gray-300 bg-white/5 hover:bg-white/10"
                      }
                      title={act.title}
                    >
                      {act.icon}
                    </button>
                  ))
                : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
