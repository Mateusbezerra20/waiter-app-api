import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';

export async function updateUser(req: Request, resp: Response) {
  const { name, email, password, role: newRole } = req.body;
  const { id: userBeingEditedId } = req.params;
  const { id: userLogedId, role: userLogedRole } = req.logedUser;

  if (!(['ADMIN', 'WAITER'].includes(newRole))) {
    return resp.status(400).json({
      message: 'Role must be one of these: ADMIN, WAITER',
    });
  }

  if (userLogedRole === 'WAITER' && userBeingEditedId !== userLogedId) {
    return resp.status(403).json({
      message: 'user is not authorized to access this resource.'
    });
  }

  const role = userLogedRole === 'WAITER' ? 'WAITER' : newRole;

  try {
    const userWithSameEmail = await User.findOne({ email });

    if (userWithSameEmail && userWithSameEmail.id !== userBeingEditedId) {
      return resp.json(400).json({
        message: 'E-mail informed is already in use.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(userBeingEditedId, {
      name,
      email,
      password: passwordHash,
      role
    });

    return resp.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return resp.sendStatus(500);
  }
}
