import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';

export async function createUser(req: Request, resp: Response) {
  const { name, email, password, role } = req.body;

  if (!(name && email && password && role)) {
    return resp.status(406).json({
      message: 'Missing data.'
    });
  }

  if (role !== 'ADMIN' && role !== 'WAITER') {
    return resp.status(406).json({
      message: 'Role must ADMIN or WAITER'
    });
  }

  try {
    const emailAlreadyExists = await User.findOne({
      email,
    });

    if (emailAlreadyExists) {
      return resp.status(400).json({
        message: 'E-mail informed is already in use.'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userCreated = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return resp.status(201).json(userCreated);
  } catch (err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
