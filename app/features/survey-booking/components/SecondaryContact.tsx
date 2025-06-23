import React, { useContext } from 'react';
import { LanguageContext } from '../../common-components/CentralBlock';

interface SecondaryContactProps {
  formData: {
    hasSecondaryContact: boolean;
    secondaryContactName: string;
    secondaryContactRelationship: string;
    secondaryContactPhone: string;
    secondaryContactEmail: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const SecondaryContact: React.FC<SecondaryContactProps> = ({
  formData,
  handleChange,
}) => {
  const { t } = useContext(LanguageContext);

  const handleRadioChange = (value: boolean) => {
    const syntheticEvent = {
      target: {
        id: 'hasSecondaryContact',
        value: value,
        name: 'hasSecondaryContact',
        type: 'radio',
        checked: value
      },
      currentTarget: {
        id: 'hasSecondaryContact',
        value: value,
        name: 'hasSecondaryContact',
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
          {t('secondaryContactQuestion')} <span className="text-red-500">{t('required')}</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasSecondaryContact"
              checked={formData.hasSecondaryContact === true}
              onChange={() => handleRadioChange(true)}
              className="mr-2"
            />
            {t('yes')}
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasSecondaryContact"
              checked={formData.hasSecondaryContact === false}
              onChange={() => handleRadioChange(false)}
              className="mr-2"
            />
            {t('no')}
          </label>
        </div>
      </div>

      {formData.hasSecondaryContact && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('secondaryContactName')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="text"
              id="secondaryContactName"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              value={formData.secondaryContactName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('secondaryContactRelationship')} <span className="text-red-500">{t('required')}</span>
            </label>
            <select
              id="secondaryContactRelationship"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              value={formData.secondaryContactRelationship}
              onChange={handleChange}
            >
              <option value="">{t('selectRelationship')}</option>
              <option value="Spouse">{t('spouse')}</option>
              <option value="Partner">{t('partner')}</option>
              <option value="Parent">{t('parent')}</option>
              <option value="Child">{t('child')}</option>
              <option value="Friend">{t('friend')}</option>
              <option value="OtherFamily">{t('otherFamily')}</option>
              <option value="Other">{t('other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('secondaryContactPhone')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="tel"
              id="secondaryContactPhone"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              placeholder="1XXXXXXXXXX"
              value={formData.secondaryContactPhone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('secondaryContactEmail')}
            </label>
            <input
              type="email"
              id="secondaryContactEmail"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              placeholder="example@example.com"
              value={formData.secondaryContactEmail}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 