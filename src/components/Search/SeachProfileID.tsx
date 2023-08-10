import React, { useState, useEffect } from 'react';

import { ReadRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';

interface Item {
    userHasProfile: number;
    profileID: number;
    organizationID: number;
    fullName: string;
}

interface SeachProfileCRUDProps {
    urls: string;
    organizationID: number;
    setProfileID: (profileID: number) => void;
}

const SeachProfile: React.FC<SeachProfileCRUDProps> = ({ urls, organizationID, setProfileID }) => {

    const [items, setItems] = useState<Item[]>([]);


    // -------------------------------Funciones Para el CRUD-------------------------------
    const fetchItems = async () => {
        try {
            const url = urls || '';

            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                const config = {
                    access_token: access_token,
                    organizationID: organizationID
                }

                const response = await ReadRequest(url, config);
                console.log(response);
                if (!response.error) {
                    if (!response.message) {
                        setItems(response);
                    }
                }
            }

        } catch (error) {
        }
    };

    // -------------------------------Funciones para la Paginacion-------------------------------
    const [searchType] = useState<'fullName'>('fullName');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'fullName'>('fullName');

    const getCurrentPageItems = () => {

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        return sortItems(filteredItems);

    };

    const handleSortPropertyChange = (property: 'fullName') => {
        // Si el usuario selecciona una nueva propiedad de ordenamiento, pero es diferente a la propiedad actual,
        // establecer la dirección de ordenamiento en "asc" (ascendente)
        if (property !== sortProperty) {
            setSortDirection('asc');
        }
        // Si el usuario selecciona una nueva propiedad de ordenamiento y es la misma que la propiedad actual,
        // alternar la dirección de ordenamiento entre "asc" y "desc"
        else {
            setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
        }

        // Establecer la nueva propiedad de ordenamiento seleccionada
        setSortProperty(property);
    };

    // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
    const filterItems = (items: Item[]) => {
        if (!items) {
            return [];
        }

        return items.filter((item) => {
            const propValue = item[searchType];

            if (propValue !== undefined && typeof propValue === 'string') {
                return propValue.toLowerCase().includes(searchTerm.toLowerCase());
            }

            return false;
        });
    }

    // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
    const sortItems = (items: Item[]) => {
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
            }

            return 0;
        });
    }

    // -------------------------------Funciones de Extra-------------------------------
    useEffect(() => {

        const obtenerTokenDeAcceso = async () => {
            await getSession();
            fetchItems();
        };

        obtenerTokenDeAcceso();

    }, []);

    return (
        <>

            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border-gray-200 py-2.5 pl-10 pr-3 shadow-sm sm:text-sm"
                />
                <select
                    id="id"
                    className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                    onChange={(e) => {
                        setProfileID(Number(e.target.value));
                    }}
                >
                    <option value="-1">Seleccione Nombre</option>
                    {getCurrentPageItems().map(item => (
                        <option key={item.userHasProfile} value={item.userHasProfile}>
                            {item.fullName}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default SeachProfile;
