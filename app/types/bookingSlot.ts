export type BookingSlotsPayload = {
  order: {
    operation: "CREATE";
    orderNo: string;
    type: string;
    duration: number;
    location: {
      address: string;
      locationName?: string;
      acceptMultipleResults?: boolean;
      acceptPartialMatch?: boolean;
    };
  };
  slots: {
    dates: string[];
    timeWindows: {
      twFrom: string;
      twTo: string;
    }[];
  };
  planning: {
    clustering: boolean;
    lockType: string;
    useDrivers: {
      driverExternalId: string;
    }[];
  };
  finishOrderBySlotEnd?: boolean;
};
