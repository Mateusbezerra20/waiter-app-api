import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface LoggedUser {
  id: string;
  role: 'ADMIN' | 'WAITER';
}

declare module 'express-serve-static-core' {
  interface Request {
    loggedUser: LoggedUser;
  }
}

export function authenticate(req: Request, resp: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return resp.sendStatus(401);
  }

  try {
    const tokenOnly = token.split(' ')[1];

    const sKey = process.env.JWT_PRIVATE_KEY;

    if (!sKey) {
      throw new Error('Authentication failed');
    }

    const payload = jwt.verify(tokenOnly, sKey) as LoggedUser;

    req.loggedUser = payload;

    next();
  } catch (err) {
    console.error(err);
    return resp.sendStatus(401);
  }
}
