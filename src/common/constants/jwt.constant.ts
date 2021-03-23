import 'dotenv/config';

export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
};

export const jwtExpire = {
  expiresIn: process.env.JWT_EXPIRE,
};
