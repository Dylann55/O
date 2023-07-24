// eslint-disable-next-line import/no-cycle
import { SignOut } from '@/utils/DBFuntion';
import { generateToken, verifyToken } from '@/utils/Jwt';
import createClient from '@/db/supabaseClient';
import { fetchDataWithConfig } from './Fetch';


export const setSession = (decoded: any): void => {
  const token = verifyToken(decoded);
  localStorage.setItem('access_token', token.session.access_token);
  localStorage.setItem('email', token.session.user.email);
  localStorage.setItem('id', token.session.user.id);
};

export const removeSession = async (): Promise<void> => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
  localStorage.removeItem('session');

  // Inicializo una instancia para las funciones de la base de datos
  const instanciaSignOut = new SignOut();
  await instanciaSignOut.signOut();

  window.location.href = '/';
};

export const getSession = async (): Promise<any | null> => {
  const { data, error } = await createClient.auth.refreshSession();

  if (error) {
    return null;
  }

  const { session } = data;

  if (session?.refresh_token) {

    const refresh_token = session.refresh_token;

    const token = generateToken({refresh_token});
    
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = process.env.NEXT_PUBLIC_MIDDLE_URL + '/auth/refreshToken';
    const response= await fetchDataWithConfig(url, config);

    const decoded = verifyToken(response);

    localStorage.setItem('session',decoded.data.session);
    localStorage.setItem('access_token_Request',decoded.data.session.access_token);
  }
};

export const checkSession = (): boolean => {
  const session = localStorage.getItem('access_token');
  if (!session) {
    return false;
  }
  return true;
};
