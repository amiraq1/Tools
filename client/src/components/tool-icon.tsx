import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToolIconProps {
  initials: string;
  color: string;
  iconUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
};

export function ToolIcon({ initials, color, iconUrl, size = "md", className }: ToolIconProps) {
  const [imageError, setImageError] = useState(false);

  if (iconUrl && !imageError) {
    return (
      <div
        className={cn(
          "rounded-lg shrink-0 overflow-hidden bg-card",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={iconUrl}
          alt={initials}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center font-bold text-white shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
