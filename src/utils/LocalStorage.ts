// eslint-disable-next-line import/no-cycle
import { RefreshSession, SignOut } from '@/utils/DBFuntion';
import { generateToken, verifyToken } from '@/utils/Jwt';
import { fetchDataWithConfig } from './Fetch';

//Esta funcion es utilizada exclusivamente para cuentas de email, cuando inicio sesion normalmente
export const setSession = (decoded: any): void => {
  const token = verifyToken(decoded);
  localStorage.setItem('access_token', token.session.access_token);
  localStorage.setItem('email', token.session.user.email);
  localStorage.setItem('id', token.session.user.id);

  // Convertir el objeto token.session a JSON
  /* 
    El método localStorage.setItem(key, value) solo acepta cadenas como valor, 
    por lo que al guardar un objeto, se convierte automáticamente en una cadena 
    "[object Object]" en lugar de un objeto.
  */
  const sessionJson = JSON.stringify(token.session);
  localStorage.setItem('session', sessionJson);
};

export const removeSession = async (): Promise<void> => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
  localStorage.removeItem('session');
  localStorage.removeItem('access_token_Request');

  // Inicializo una instancia para las funciones de la base de datos
  const instanciaSignOut = new SignOut();
  await instanciaSignOut.signOut();

  window.location.href = '/';
};

export const getSessionPrevious = async (): Promise<any | null> => {
  const sessionJson = localStorage.getItem('session');

  //Si no existe la session, esto pasa cuando se inicia sesion con cuentas google o linkdin, envez de usar por email
  if (!sessionJson) {

    const instanciaRefreshSession = new RefreshSession();

    const session = await instanciaRefreshSession.refreshSession();
    return session
  } else {

    try {
      /*
        El bloque try se utiliza para intentar analizar la cadena 
        JSON almacenada en localStorage y convertirla en un objeto      
      */
      const session = JSON.parse(sessionJson); // Intentar analizar la cadena JSON
      return session;
    } catch (error) {

      return null; 
    }

  }
};

export const getSession = async (): Promise<any | null> => {
  
  const session = await getSessionPrevious();
  if (session?.refresh_token) {

    const refresh_token = session.refresh_token;
    console.log(refresh_token);
    const token = generateToken({ refresh_token });
    
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = process.env.NEXT_PUBLIC_MIDDLE_URL + '/auth/refreshToken';
    const response = await fetchDataWithConfig(url, config);

    const decoded = verifyToken(response);
    const sessionJson = JSON.stringify(decoded.data.session);
    localStorage.setItem('session', sessionJson);
    localStorage.setItem('access_token_Request', decoded.data.session.access_token);
  }
};

export const checkSession = (): boolean => {
  const session = localStorage.getItem('access_token');
  if (!session) {
    return false;
  }
  return true;
};
