import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { decode } from './base64';

const JwtData = z.object({
  email: z.string().email(),
  id: z.string(),
});

type JwtData = z.TypeOf<typeof JwtData>;

export function signJwt(key: string, data: JwtData, options: SignOptions = {}) {
  const privateKey = decode(key);
  return jwt.sign(data, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(key: string, token: string) {
  const publicKey = decode(key);
  return jwt.verify(token, publicKey) as T;
}
