import Router from 'next/router';
import { verifyToken } from './Jwt';

export const setSession = (decoded: any): void => {
  const token = verifyToken(decoded);
  localStorage.setItem('sesion', decoded);
  localStorage.setItem('email', token.email);
  Router.push('/Lobby');
};

export const removeSession = (): void => {
  localStorage.removeItem('sesion');
  localStorage.removeItem('email');
};

export const checkSession = (): boolean => {
  const session = localStorage.getItem('sesion');
  if (!session) {
    return false;
  }
  return true;
};
