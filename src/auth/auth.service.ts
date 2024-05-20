import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { TokenService } from 'src/token/token.service';
import { UsersService } from 'src/users/users.service';
import { SignInDto, SignUpDto } from './dto';
import { User } from 'src/schemas';
import { IUser } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpDto): Promise<User> {
    if (dto.password !== dto.passwordConfirm)
      throw new HttpException('The passwords must match', 403);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const payload = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };
    const user = await this.usersService.create(payload);
    return user;
  }

  async signIn(dto: SignInDto): Promise<IUser> {
    const _user = await this.usersService.getByEmail(dto.email);

    if (!_user) throw new HttpException('User not found', 404);
    if (!(await bcrypt.compare(dto.password, _user.password)))
      throw new UnauthorizedException();

    const payload = this.tokenService.generatePayload(_user);
    const token = this.tokenService.sign(payload);
    const user = {
      name: _user.name,
      email: _user.email,
      role: _user.role,
      authToken: token,
    };
    return user;
  }
}
