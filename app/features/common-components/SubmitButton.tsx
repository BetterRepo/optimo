interface SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  onSubmit, 
  isSubmitting, 
  errorMessage,
  disabled 
}) => {
  return (
    <div className="text-center">
      <button
        onClick={onSubmit}
        disabled={isSubmitting || disabled}
        className={`
          px-8 py-3 rounded-lg text-white font-medium
          transition-all duration-200
          ${isSubmitting || disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#5FCF87] hover:bg-green-600 active:bg-[#5FCF87]'
          }
        `}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {errorMessage && (
        <p className="text-red-500 mt-2">{errorMessage}</p>
      )}
    </div>
  );
}; 