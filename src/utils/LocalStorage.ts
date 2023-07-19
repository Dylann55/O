import { verifyToken } from './Jwt';
import createClient from '@/db/supabaseClient';

export const setSession = (decoded: any): void => {
  const token = verifyToken(decoded);
  localStorage.setItem('sesion', decoded);
  localStorage.setItem('email', token.email);
};

export const removeSession = async (): Promise<void> => {
  localStorage.removeItem('sesion');
  localStorage.removeItem('email');
  await createClient.auth.signOut();
};

export const checkSessionSocial = (): void => {
  if (!checkSession()) {
    createClient.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        const access_token = session?.access_token;
        const email = session?.user?.email;

        if (access_token && email) {
          localStorage.setItem('sesion', access_token);
          localStorage.setItem('email', email);
        }
        window.location.reload();
      }
    });
  }
}

export const checkSession = (): boolean => {
  const session = localStorage.getItem('sesion');
  if (!session) {
    return false;
  }
  return true;
};
