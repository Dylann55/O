interface Item {
  vehicleID: number;
  patent: string;
  mark: string;
  model: string;
  maxWeight: number;

  organizationID: number;
  name: string;

  
}

const filterItems = (items: Item[], searchType: keyof Item, searchTerm: string) => {
  return items.filter((item) => {
    if (searchType === 'vehicleID' || searchType === 'maxWeight' || searchType === 'organizationID') {
      return item[searchType].toString().includes(searchTerm);
    } else {
      return item[searchType].toLowerCase().includes(searchTerm.toLowerCase());
    }
  });
};

const sortItems = (items: Item[], sortProperty: keyof Item, sortDirection: string) => {
  return items.sort((a, b) => {
    const propA = sortProperty === 'vehicleID' || sortProperty === 'organizationID' ? a.vehicleID : a[sortProperty];
    const propB = sortProperty === 'vehicleID' || sortProperty === 'organizationID' ? b.vehicleID : b[sortProperty];

    if (typeof propA === 'string' && typeof propB === 'string') {
      return sortDirection === 'asc' ? propA.localeCompare(propB) : propB.localeCompare(propA);
    } else {
      const propAString = String(propA);
      const propBString = String(propB);

      return sortDirection === 'asc' ? propAString.localeCompare(propBString) : propBString.localeCompare(propAString);
    }
  });
};


