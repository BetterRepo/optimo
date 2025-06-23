export const formatTime = (timeString: string): string => {
    if (!timeString) return "";
  
    const timePart = timeString.includes("T") ? timeString.split("T")[1] : timeString;
    const [hour, minute] = timePart.split(":").map(Number);
  
    if (isNaN(hour) || isNaN(minute)) {
      return "Invalid time";
    }
  
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
  
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  