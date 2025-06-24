'use client';

import React from 'react';

type FinanceType = 'PPA' | 'Lease' | 'Loan' | 'Prepaid-PPA';

interface FinanceTypeSelectorProps {
  selectedType: FinanceType | '';
  onChange: (value: FinanceType) => void;
}

export const FinanceTypeSelector: React.FC<FinanceTypeSelectorProps> = ({
  selectedType,
  onChange
}) => {
  const types = [
    { id: 'PPA', label: 'PPA' },
    { id: 'Lease', label: 'Lease' },
    { id: 'Loan', label: 'Loan' },
    { id: 'Prepaid-PPA', label: 'Prepaid-PPA' }
  ];

  return (
    
    <div className="space-y-4">

      <label className="block text-gray-700 dark:text-gray-200 font-semibold">
        Finance Type <span className="text-red-500">*</span>
      </label>


      <div className="dark:bg-gray-800 p-4 rounded-lg space-y-2">
        {types.map((type) => (
          <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="financeType"
              value={type.id}
              checked={selectedType === type.id}
              onChange={(e) => onChange(e.target.value as FinanceType)}
              className="form-radio text-[#69D998] focus:ring-[#69D998] h-6 w-6"
            />
            <span className="text-gray-700 dark:text-gray-200">{type.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}; 