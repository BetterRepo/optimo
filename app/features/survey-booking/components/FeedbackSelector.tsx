import React, { useState } from 'react';
import { FaSmile, FaMeh, FaFrown, FaCheck, FaMobile, FaPaintBrush, FaComments, FaLanguage } from 'react-icons/fa';

type FeedbackOption = 'happy' | 'neutral' | 'unhappy';
type FeatureOption = 'mobile-app' | 'better-design' | 'live-chat' | 'spanish-version';

interface FeedbackSelectorProps {
  value?: FeedbackOption;
  onChange: (value: FeedbackOption) => void;
  onFeatureSelect?: (features: FeatureOption[]) => void;
}

const FeedbackSelector: React.FC<FeedbackSelectorProps> = ({ 
  value, 
  onChange, 
  onFeatureSelect = () => {} 
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureOption[]>([]);

  // Get the appropriate GIF based on selected value
  const getGifSrc = () => {
    if (!value) {
      return '/images/feedback-gif.gif'; // Default GIF to show before selection
    }
    
    switch (value) {
      case 'happy':
        return '/images/steve-happy3.gif';
      case 'neutral':
        return '/images/netral-steve.gif';
      case 'unhappy':
        return '/images/steve harvey-sad.gif';
      default:
        return '/images/feedback-gif.gif';
    }
  };
  
  // Determine if we're showing a GIF that needs to display text at the bottom
  const isTextGif = !value || value === 'unhappy'; // The default and unhappy GIFs have text

  // Toggle feature selection
  const toggleFeature = (feature: FeatureOption) => {
    const newSelectedFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    
    setSelectedFeatures(newSelectedFeatures);
    onFeatureSelect(newSelectedFeatures);
  };
  
  // Feature options data
  const featureOptions = [
    { id: 'mobile-app', icon: <FaMobile />, label: 'Mobile app for project creation' },
    { id: 'better-design', icon: <FaPaintBrush />, label: 'Better Design' },
    { id: 'live-chat', icon: <FaComments />, label: 'Live Chat Support' },
    { id: 'spanish-version', icon: <FaLanguage />, label: 'Spanish Version' },
  ];
  
  return (
    <div className="flex flex-col items-center justify-center py-2">
      {/* Steve Harvey GIF animation - always show a GIF */}
      <div className="mb-4 h-64 w-full max-w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-transparent shadow-sm flex items-center justify-center">
        <img 
          src={getGifSrc()}
          alt={value ? `Steve Harvey ${value} reaction` : "Steve Harvey feedback options"}
          className={`${isTextGif ? 'max-h-full max-w-full object-contain' : 'h-[220px] w-[220px] object-cover'}`}
          style={{ objectPosition: 'center' }}
        />
      </div>
      
      <div className="flex items-center justify-center gap-16 md:gap-24">
        {/* Unhappy - Left */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => onChange('unhappy')}
            className={`mb-2 ${
              value === 'unhappy' 
                ? 'text-red-500' 
                : 'text-gray-400 hover:text-red-500'
            } transition-all duration-200 focus:outline-none`}
            aria-label="Unhappy"
          >
            <FaFrown size={22} />
          </button>
          <span className={`text-xs ${value === 'unhappy' ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            Unhappy
          </span>
        </div>
        
        {/* Neutral - Middle */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => onChange('neutral')}
            className={`mb-2 ${
              value === 'neutral' 
                ? 'text-amber-500' 
                : 'text-gray-400 hover:text-amber-500'
            } transition-all duration-200 focus:outline-none`}
            aria-label="Neutral"
          >
            <FaMeh size={22} />
          </button>
          <span className={`text-xs ${value === 'neutral' ? 'text-amber-500 font-medium' : 'text-gray-500'}`}>
            Neutral
          </span>
        </div>
        
        {/* Happy - Right */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => onChange('happy')}
            className={`mb-2 ${
              value === 'happy' 
                ? 'text-green-600' 
                : 'text-gray-400 hover:text-green-600'
            } transition-all duration-200 focus:outline-none`}
            aria-label="Happy"
          >
            <FaSmile size={22} />
          </button>
          <span className={`text-xs ${value === 'happy' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            Happy
          </span>
        </div>
      </div>

      {/* Feature request section - shown after selecting a feedback option */}
      {value && (
        <div className="mt-8 w-full max-w-[500px] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 shadow-sm border border-blue-100 dark:border-blue-800/40 transition-opacity duration-300">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
            What Should We Add Next?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureOptions.map((feature) => (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id as FeatureOption)}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 text-left
                  ${selectedFeatures.includes(feature.id as FeatureOption)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-blue-50 shadow-sm'
                  }`}
              >
                <div className={`mr-3 text-xl ${selectedFeatures.includes(feature.id as FeatureOption) ? 'text-white' : 'text-blue-500'}`}>
                  {feature.icon}
                </div>
                <span className="text-sm">{feature.label}</span>
                {selectedFeatures.includes(feature.id as FeatureOption) && (
                  <div className="ml-auto">
                    <FaCheck className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-3">
            Select all that you&apos;d like to see implemented
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSelector; 