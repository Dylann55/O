// Función para filtrar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
export const filterItems = (items: any[], searchTerm: string, searchType: string) => {
    if (!items) {
        return [];
    }

    return items.filter((item) => {
        const propValue = item[searchType];

        if (propValue !== undefined && typeof propValue === 'number') {
            return propValue.toString().includes(searchTerm);
        }

        if (typeof propValue === 'string') {
            return propValue.toLowerCase().includes(searchTerm.toLowerCase());
        }

        if (propValue instanceof Date) {
            const searchTermDate = new Date(searchTerm);

            // Verificar si la fecha ingresada es válida
            if (isNaN(searchTermDate.getTime())) {
                return false;
            }

            // Comparar las fechas ignorando las horas, minutos, segundos y milisegundos
            return propValue.getTime() === searchTermDate.getTime();
        }

        return false;
    });
};

// Función para ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
export const sortItems = (items: any[], sortProperty: string, sortDirection: string) => {
    return items.sort((a, b) => {
        const propA = a[sortProperty];
        const propB = b[sortProperty];

        if (propA !== undefined && propB !== undefined) {
            if (typeof propA === 'string' && typeof propB === 'string') {
                return sortDirection === 'asc' ? propA.localeCompare(propB) : propB.localeCompare(propA);
            }

            if (typeof propA === 'number' && typeof propB === 'number') {
                return sortDirection === 'asc' ? propA - propB : propB - propA;
            }

            if (propA instanceof Date && propB instanceof Date) {
                return sortDirection === 'asc' ? propA.getTime() - propB.getTime() : propB.getTime() - propA.getTime();
            }
        }

        return 0;
    });
};
