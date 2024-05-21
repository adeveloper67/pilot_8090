import { Types } from 'mongoose';

export interface IPayload {
  sub: Types.ObjectId;
  type: string;
  role: string;
  iat?: Date;
  exp?: Date;
}
