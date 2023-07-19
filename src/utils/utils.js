
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

const jwt = require('jsonwebtoken');
//npm install jsonwebtoken@8.5.0

const generateToken = (data) => {
  return jwt.sign(data, '3VHHBNWJPXDEenSVW7McpPQYhEaVSgkqmtZ6x9bRRM4VpbL8UrrnZPVRQHEZX');
};

const verifyToken = (data) => {
  return jwt.verify(data, '3VHHBNWJPXDEenSVW7McpPQYhEaVSgkqmtZ6x9bRRM4VpbL8UrrnZPVRQHEZX');
};

const Router = require('next/router');

const setSession = (decoded) => {
  const token = verifyToken(decoded);
  localStorage.setItem('sesion', JSON.stringify(decoded));
  localStorage.setItem('email', token.email);
};

const removeSession = async () => {
  localStorage.removeItem('sesion');
  localStorage.removeItem('email');
  await createClient.auth.signOut();
};

const checkSessionSocial = () => {
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

module.exports = {
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
