import { Types } from 'mongoose';

export interface IPayload {
  sub: Types.ObjectId;
  email: string;
  role: string;
  iat?: Date;
  exp?: Date;
}
