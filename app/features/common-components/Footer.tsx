import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#000000]/80 backdrop-blur-sm py-1 z-50">
      <div className="container mx-auto text-center">
        <span className="bg-gradient-to-r from-[#69D998] to-[#09ac9c] dark:from-[#69D998] dark:to-[#2be8d5] 
                        bg-clip-text text-transparent font-medium text-xs">
          © {new Date().getFullYear()} Better Earth. All rights reserved.
        </span>
      </div>
    </footer>
  );
}; 