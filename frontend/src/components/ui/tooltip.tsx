// src/components/ui/tooltip.tsx
"use client";

import { ReactNode, useState } from "react";

type Position = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  text: string;
  position?: Position;
  children: ReactNode;
}

export const Tooltip = ({ text, position = "top", children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="w-full"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 min-w-max`}
        >
          <div className="px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg flex items-center justify-center relative">
            {text}
            {/* Flecha del tooltip */}
            <div
              className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
                position === "top" 
                  ? "-bottom-1 left-1/2 -translate-x-1/2"
                  : position === "bottom"
                  ? "-top-1 left-1/2 -translate-x-1/2"
                  : position === "left"
                  ? "-right-1 top-1/2 -translate-y-1/2"
                  : "-left-1 top-1/2 -translate-y-1/2"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};