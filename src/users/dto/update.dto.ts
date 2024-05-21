import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  userId: Types.ObjectId;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  role?: string;
}
