import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-[#151821]/80 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/50 dark:border-[#5FCF87]/20"
    >
      {children}
    </motion.div>
  );
};

export default FeatureCard;
