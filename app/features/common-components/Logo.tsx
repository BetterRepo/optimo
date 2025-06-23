import Image from "next/image";
import React from "react";

interface LogoProps {
  isDark: boolean;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  isDark, 
  width = 220, 
  height = 140 
}) => {
  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
      <div className="relative p-2.5 rounded-2xl backdrop-blur-[2px] bg-white/10 dark:bg-black/10">
        <Image
          src={isDark ? "/images/be-logo-light.png" : "/images/be-logo-dark.png"}
          alt="Better Earth Logo"
          width={width}
          height={height}
          priority
          className="relative z-10"
        />
      </div>
    </div>
  );
}; 