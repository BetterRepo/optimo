interface LanguageSelectorProps {
    language: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }
  
  export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onChange }) => {
    return (
      <div className="mb-6 w-1/2">
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
          Preferred Language <span className="text-red-500">*</span>
        </label>
        <select
          id="language"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                   focus:outline-none focus:border-purple-500
                   bg-white dark:bg-[#3A3B3C] dark:text-white"
          value={language}
          onChange={onChange}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>
      </div>
    );
  };