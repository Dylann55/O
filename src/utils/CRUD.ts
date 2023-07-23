import createClient from '@/db/supabaseClient';
import { fetchDataWithConfig } from "./Fetch";
import { generateToken } from './Jwt';


// Función genérica para realizar una solicitud POST
export const ReadRequest = async (url: string, newItem: any): Promise<any> => {
    const token = generateToken(newItem);

    const config = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetchDataWithConfig(url, config);
    return response;
};

export const ReadRequestS = async (table: string): Promise<any> => {
    const response = await createClient.from(table).select('*');
    return response;
};

// Función genérica para realizar una solicitud POST
export const CreateRequest = async (url: string, newItem: any): Promise<any> => {

    const token = generateToken(newItem);

    const config = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetchDataWithConfig(url, config);
    return response;
};

// Función genérica para realizar una solicitud PUT
export const UpdateRequest = async (url: string, newItem: any): Promise<any> => {
    const token = generateToken(newItem);

    const config = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetchDataWithConfig(url, config);
    return response;
};

export const DeleteRequest = async (url: string, Item: any): Promise<any> => {

    const token = generateToken(Item);

    const config = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await fetchDataWithConfig(url, config);
    return response;

}
