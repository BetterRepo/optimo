import { lookupTable } from '../data/lookupTable';
import { Warehouse } from '../types/Warehouse';

export const findWarehouseByZip = (zipCode: string): Warehouse => {
  // Special case for Concord area
  if (zipCode.startsWith("945")) {
    return "Sacramento, CA" as Warehouse;
  }
  
  const entry = lookupTable.find(entry => entry.zip === zipCode);
  return entry ? entry.warehouse as Warehouse : "Out of Region" as Warehouse;
}; 