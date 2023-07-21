interface SortOption<T> {
    sortType: keyof T;
    sortDirection: 'asc' | 'desc';
  }
  
  export function sortItems<T>(items: T[], { sortDirection }: SortOption<T>, compareFn: (a: T, b: T) => number): T[] {
    return items.slice().sort((a, b) => {
      const compareResult = compareFn(a, b);
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  }
  