interface TimeSlotCardProps {
  date: Date;
  time: string;
  label: string;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ date, time, label }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xl text-gray-900 dark:text-white">{formatDate(date)}</span>
      </div>
      <div className="bg-white dark:bg-gray-900/40 rounded-lg p-6 border border-green-100 dark:border-transparent">
        <span className="text-green-900 dark:text-green-400 text-2xl font-medium block mb-2">{time}</span>
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}; 