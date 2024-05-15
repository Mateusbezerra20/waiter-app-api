import { Request, Response } from 'express';
import { User } from '../../models/User';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req: Request, resp: Response) {
  const { email, password } = req.body;

  if (!(email && password)) {
    return resp.status(406).json({
      message: 'Authentication data are missing'
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resp.status(404).json({
        message: 'User not found'
      });
    }

    const match = await compare(password, user.password);

    if (match) {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        `${process.env.JWT_PRIVATE_KEY}`,
        { expiresIn: '2 days' },
      );

      return resp.status(200).json(token);
    }

    return resp.status(401).json({
      message: 'Invalid password'
    });
  } catch (err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
