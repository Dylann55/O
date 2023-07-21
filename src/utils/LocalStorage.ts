// eslint-disable-next-line import/no-cycle
import { SignOut } from '@/utils/DBFuntion';
import { verifyToken } from '@/utils/Jwt';

export const setSession = (decoded: any): void => {
  const token = verifyToken(decoded);
  localStorage.setItem('sesion', token.access_token);
};

export const removeSession = async (): Promise<void> => {
  localStorage.removeItem('sesion');
  localStorage.removeItem('email');
  // Inicializo un clase para las funciones de la base de datos
  const instanciaSignOut = new SignOut();
  await instanciaSignOut.signOut();
};

export const checkSession = (): boolean => {
  const session = localStorage.getItem('sesion');
  if (!session) {
    return false;
  }
  return true;
};
