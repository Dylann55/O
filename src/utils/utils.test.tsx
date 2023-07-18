import { isPasswordValid } from '@/utils/VerifyUser';

describe('isPasswordValid', () => {
  it('debería retornar true para una contraseña válida', () => {
    const validPassword = 'Password123$';
    const result = isPasswordValid(validPassword);
    expect(result).toBe(true);
  });

  it('debería retornar false para una contraseña con longitud menor a 6', () => {
    const shortPassword = 'Pass1$'; // Menos de 6 caracteres
    const result = isPasswordValid(shortPassword);
    expect(result).toBe(false);
  });

  it('debería retornar false para una contraseña sin letras mayúsculas', () => {
    const lowercasePassword = 'password123$'; // Sin letras mayúsculas
    const result = isPasswordValid(lowercasePassword);
    expect(result).toBe(false);
  });

  it('debería retornar false para una contraseña sin letras minúsculas', () => {
    const uppercasePassword = 'PASSWORD123$'; // Sin letras minúsculas
    const result = isPasswordValid(uppercasePassword);
    expect(result).toBe(false);
  });

  it('debería retornar false para una contraseña sin números', () => {
    const noNumberPassword = 'Password$'; // Sin números
    const result = isPasswordValid(noNumberPassword);
    expect(result).toBe(false);
  });

  it('debería retornar false para una contraseña sin caracteres especiales', () => {
    const noSpecialCharPassword = 'Password123'; // Sin caracteres especiales
    const result = isPasswordValid(noSpecialCharPassword);
    expect(result).toBe(false);
  });
});
