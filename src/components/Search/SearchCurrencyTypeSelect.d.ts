// SearchCurrencyTypeSelect.d.ts
import { ReactElement } from 'react';

declare module '@/components/Search/SearchCurrencyTypeSelect' {

  type SearchCurrencyTypeSelectProps = {
    setItemID: (currencyType: string) => void;
  };

  const SearchCurrencyTypeSelect: (props: SearchCurrencyTypeSelectProps) => ReactElement;
  export default SearchCurrencyTypeSelect;
}
