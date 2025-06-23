import React, { useContext } from 'react';
import { LanguageContext } from '../../common-components/CentralBlock';

interface TenantContactProps {
  formData: {
    hasTenants: boolean;
    tenantName: string;
    tenantPhone: string;
    tenantEmail: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const TenantContact: React.FC<TenantContactProps> = ({
  formData,
  handleChange,
}) => {
  const { t } = useContext(LanguageContext);

  const handleRadioChange = (value: boolean) => {
    const syntheticEvent = {
      target: {
        id: 'hasTenants',
        value: value,
        name: 'hasTenants',
        type: 'radio',
        checked: value
      },
      currentTarget: {
        id: 'hasTenants',
        value: value,
        name: 'hasTenants',
        type: 'radio',
        checked: value
      },
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 2,
      isTrusted: true,
      timeStamp: Date.now(),
      type: 'change',
      nativeEvent: new Event('change'),
      preventDefault: () => {},
      stopPropagation: () => {},
      isPropagationStopped: () => false,
      isDefaultPrevented: () => false,
      persist: () => {}
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

  return (
    <div className="mb-8">
      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          {t('tenantQuestion')} <span className="text-red-500">{t('required')}</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center text-gray-900 dark:text-white">
            <input
              type="radio"
              name="hasTenants"
              checked={formData.hasTenants === true}
              onChange={() => handleRadioChange(true)}
              className="mr-2"
            />
            {t('yes')}
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasTenants"
              checked={formData.hasTenants === false}
              onChange={() => handleRadioChange(false)}
              className="mr-2"
            />
            {t('no')}
          </label>
        </div>
      </div>

      {formData.hasTenants && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('tenantName')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="text"
              id="tenantName"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              value={formData.tenantName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('tenantPhone')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="tel"
              id="tenantPhone"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              placeholder="1XXXXXXXXXX"
              value={formData.tenantPhone}
              onChange={handleChange}
            />
            <div className="text-sm text-gray-500 mt-1">1XXXXXXXXXX</div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('tenantEmail')}
            </label>
            <input
              type="email"
              id="tenantEmail"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              placeholder="example@example.com"
              value={formData.tenantEmail}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 