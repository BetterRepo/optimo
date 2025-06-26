import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface FeatureHeaderProps {
  title: string;
  Icon: IconType;
}

const FeatureHeader: React.FC<FeatureHeaderProps> = ({ title, Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center mb-6 space-x-2 text-gray-800 dark:text-gray-100"
    >
      <Icon className="w-6 h-6 text-[#5FCF87]" />
      <h1 className="text-2xl font-semibold">{title}</h1>
    </motion.div>
  );
};

export default FeatureHeader;
