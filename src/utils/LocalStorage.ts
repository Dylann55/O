// eslint-disable-next-line import/no-cycle
import { SignOut } from '@/utils/DBFuntion';
import { verifyToken } from '@/utils/Jwt';
import createClient from '@/db/supabaseClient';

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
  console.log(session?.access_token);
  return session?.access_token;
};

export const checkSession = (): boolean => {
  const session = localStorage.getItem('access_token');
  if (!session) {
    return false;
  }
  return true;
};
