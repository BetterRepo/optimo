// Define valid warehouse locations
export type Warehouse =
  | "Cerritos, CA"
  | "Fresno, CA"
  | "Sacramento, CA"
  | "Lakeland, FL"
  | "Dallas, TX"
  | "Phoenix, AZ"
  | "Out of Region";

// Define driver details
export interface Driver {
  driverExternalId: string;
}

// Define the driver mapping object
export const driverMapping: Record<Warehouse, Driver[]> = {
  "Cerritos, CA": [
    { driverExternalId: "29464438" },
    { driverExternalId: "29464646" },
    { driverExternalId: "53682348" },
  ],
  "Fresno, CA": [{ driverExternalId: "18699899" }],
  "Sacramento, CA": [
    { driverExternalId: "20045023" },
    { driverExternalId: "25637321" },
  ],
  "Dallas, TX": [{ driverExternalId: "39913775" }], // Houston-Nate Nathan
  "Lakeland, FL": [{ driverExternalId: "49949202" }],
  "Phoenix, AZ": [{ driverExternalId: "53682348" }], // Alex Campbell - AZ
  "Out of Region": [],
};
