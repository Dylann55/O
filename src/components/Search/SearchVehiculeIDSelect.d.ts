// SearchVehiculeIDSelect.d.ts
import { ReactElement } from 'react';

declare module '@/components/Search/SearchVehiculeIDSelect' {
  type Vehicule = {
    vehicleID: number;
    patent: string;
    mark: string;
    model: string;
    maxWeight: number;
  };

  type SearchVehiculeIDSelectProps = {
    items: Vehicule[];
    setItemID: (vehiculeID: number) => void;
  };

  const SearchVehiculeIDSelect: (props: SearchVehiculeIDSelectProps) => ReactElement;
  export default SearchVehiculeIDSelect;
}
