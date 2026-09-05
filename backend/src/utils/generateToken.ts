import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Signs a JWT embedding the user's id as the subject.
 */
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  return jwt.sign({ sub: userId }, secret, { expiresIn });
};
