import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FocusFrameBorderProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  duration?: number;
  color?: string;
};

const corners = [
  {
    position: "top-0 left-0",
    edges: "border-t border-l rounded-tl-3xl",
    delay: 0,
  },
  {
    position: "top-0 right-0",
    edges: "border-t border-r rounded-tr-3xl",
    delay: 0.3,
  },
  {
    position: "bottom-0 left-0",
    edges: "border-b border-l rounded-bl-3xl",
    delay: 0.6,
  },
  {
    position: "bottom-0 right-0",
    edges: "border-b border-r rounded-br-3xl",
    delay: 0.9,
  },
];

const FocusFrameBorder = ({
  children,
  className,
  contentClassName,
  duration = 2.4,
  color = "#f59e0b",
}: FocusFrameBorderProps) => {
  return (
    <>
      <style>{`
        @keyframes focus-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .animate-focus-pulse {
          animation: focus-pulse var(--duration, 2.4s) ease-in-out infinite;
        }
      `}</style>
      <div className={cn("relative rounded-3xl", className)}>
        {/* Pulsing corner brackets */}
        {corners.map((corner) => (
          <div
            key={corner.position}
            className={cn(
              "absolute z-20 size-10 pointer-events-none animate-focus-pulse",
              corner.position,
              corner.edges,
            )}
            style={
              {
                borderColor: color,
                filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color})`,
                animationDelay: `${corner.delay}s`,
                "--duration": `${duration}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Content Layer */}
        <div
          className={cn(
            "relative z-10 rounded-3xl border border-amber-500/20 overflow-hidden h-full",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default FocusFrameBorder;
