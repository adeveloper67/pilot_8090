import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/schemas';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersModel.create(dto);

    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = this.usersModel.findOne({ email });

    return user;
  }

  async update(dto: UpdateUserDto): Promise<User> {
    const user = this.usersModel.findByIdAndUpdate(dto.userId, { $set: dto });

    return user;
  }
}
