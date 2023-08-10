// SearchProfileIDSelect.d.ts
import { ReactElement } from 'react';

declare module '@/components/Search/SearchProfileIDSelect' {
  type Profile = {
    userHasProfile: number;
    profileID: number;
    organizationID: number;
    fullName: string;
  };

  type SearchProfileIDSelectProps = {
    items: Profile[];
    setItemID: (profileID: number) => void;
  };

  const SearchProfileIDSelect: (props: SearchProfileIDSelectProps) => ReactElement;
  export default SearchProfileIDSelect;
}
