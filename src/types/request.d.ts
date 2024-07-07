import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

export interface UserRequest extends Request {
  user?: JwtPayload;
}
