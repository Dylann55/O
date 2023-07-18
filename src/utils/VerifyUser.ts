export const isPasswordValid = (password: string): boolean => {
  const minLength = 6; // Longitud mínima de la contraseña
  const hasUppercase = /[A-Z]/.test(password); // Verificar si contiene al menos una letra mayúscula
  const hasLowercase = /[a-z]/.test(password); // Verificar si contiene al menos una letra minúscula
  const hasNumber = /[0-9]/.test(password); // Verificar si contiene al menos un número
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password); // Verificar si contiene al menos un carácter especial

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar
  );
};
