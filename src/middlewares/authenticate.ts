import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface LogedUser {
  id: string;
  role: 'ADMIN' | 'WAITER';
}

declare module 'express-serve-static-core' {
  interface Request {
    logedUser: LogedUser;
  }
}

export function authenticate(req: Request, resp: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return resp.sendStatus(401);
  }

  try {
    const tokenOnly = token?.split(' ')[1];

    const sKey = process.env.JWT_PRIVATE_KEY || 'anotherSecretKey';

    const payload = jwt.verify(tokenOnly, sKey) as LogedUser;

    req.logedUser = payload;

    next();
  } catch (err) {
    console.error(err);
    return resp.sendStatus(401);
  }
}
