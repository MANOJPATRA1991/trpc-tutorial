import jwt from 'jsonwebtoken';
import { z } from 'zod';

const SECRET = process.env.SECRET || 'changeme';

const JwtData = z.object({
  email: z.string().email(),
  id: z.string(),
});

type JwtData = z.TypeOf<typeof JwtData>;

export function signJwt(data: JwtData) {
  return jwt.sign(data, SECRET);
}

export function verifyJwt<T>(token: string) {
  return jwt.verify(token, SECRET) as T;
}
