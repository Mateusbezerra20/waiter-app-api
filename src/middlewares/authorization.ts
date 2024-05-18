import { NextFunction, Request, Response } from 'express';

export function authorization(allowedRoles: string[]) {
  return (req: Request, resp: Response, next: NextFunction) => {
    if (!(allowedRoles.includes(req.logedUser.role))) {
      return resp.status(403).json({
        message: 'Access denied'
      });
    }

    next();
  };
}
