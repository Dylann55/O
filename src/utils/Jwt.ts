const jwt = require('jsonwebtoken');
//npm install jsonwebtoken@8.5.0

export const generateToken = (data: any): string => {
  return jwt.sign(data, process.env.NEXT_PUBLIC_SECRET_TOKEN);
};

export const verifyToken = (data: string): any => {
  return jwt.verify(data, process.env.NEXT_PUBLIC_SECRET_TOKEN);
};
