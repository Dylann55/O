/* eslint-disable import/no-unresolved */
import { sign, verify } from 'jsonwebtoken';

const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const fetchDataWithConfig = async (url, config) => {
  const response = await fetch(url, config);
  return response.json();
};

const checkStatus = async (url, config) => {
  const response = await fetch(url, config);
  return response.ok;
};
// npm install jsonwebtoken@8.5.0

const secretToken =
  '3VHHBNWJPXDEenSVW7McpPQYhEaVSgkqmtZ6x9bRRM4VpbL8UrrnZPVRQHEZX';

const generateToken = (data) => {
  return sign(data, secretToken);
};

const verifyToken = (data) => {
  return verify(data, secretToken);
};

const setSession = (decoded) => {
  const token = verifyToken(decoded);
  localStorage.setItem('sesion', JSON.stringify(decoded));
  localStorage.setItem('email', token.email);
};

const removeSession = async () => {
  localStorage.removeItem('sesion');
  localStorage.removeItem('email');
  // eslint-disable-next-line no-undef
  await createClient.auth.signOut();
};

const checkSession = () => {
  const session = localStorage.getItem('sesion');
  if (!session) {
    return false;
  }
  return true;
};

const isPasswordValid = (password) => {
  const minLength = 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  fetchData,
  fetchDataWithConfig,
  checkStatus,
  generateToken,
  verifyToken,
  setSession,
  removeSession,
  checkSession,
  isPasswordValid,
};
