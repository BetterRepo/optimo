 
import { fetchSlots } from '../../../../services/booking';

export const useTimeSlots = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDateSelect = async (date: Date) => {
    setLoading(true);
    try {
      const slots = await fetchSlots(date);
      setAvailableSlots(slots);
    } catch (err) {
      setError('Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  };

  return {
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    loading,
    error,
    handleDateSelect,
  };
};