import createClient from '@/db/supabaseClient';
import { fetchData, fetchDataWithConfig } from "./Fetch";


// Función genérica para realizar una solicitud POST
export const ReadRequest = async (url: string): Promise<any> => {
    const response = await fetchData(url);
    return response;
};

export const ReadRequestS = async (url: string): Promise<any> => {
    console.log(url);
    const response = await createClient.from('user').select('*');
    return response;
};

// Función genérica para realizar una solicitud POST
export const CreateRequest = async (url: string, newItem: any): Promise<any> => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    };

    const response = await fetchDataWithConfig(url, config);
    return response;
};

// Función genérica para realizar una solicitud PUT
export const UpdateRequest = async (url: string, newItem: any): Promise<any> => {
    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    };

    const response = await fetchDataWithConfig(url, config);
    return response;
};

export const DeleteRequest = async (url: string, idsToDelete: any): Promise<any> => {

    const config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(idsToDelete),
    }

    const response = await fetchDataWithConfig(url, config);
    return response;

}
