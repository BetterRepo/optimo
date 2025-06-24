"use client";
import React from 'react';

export const HelpBubble: React.FC = () => {
  return (
    <a
      href="sms:+13322507372"
      className="fixed bottom-4 right-4 bg-gradient-to-r from-[#69D998] to-[#09ac9c] dark:from-[#69D998] dark:to-[#2be8d5] text-white py-2 px-4 rounded-full shadow-lg z-50 text-sm hover:opacity-90"
    >
      Need help? Text now: (332)-250-7372
    </a>
  );
};
