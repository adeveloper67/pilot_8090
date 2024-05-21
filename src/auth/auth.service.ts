import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { MailerService } from '@nestjs-modules/mailer';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { TokenService } from 'src/token/token.service';
import { UsersService } from 'src/users/users.service';
import { PasswordResetDto, SignInDto, SignUpDto } from './dto';
import { IUser } from './interfaces';
import { Token } from 'src/enums';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpDto): Promise<IUser> {
    if (dto.password !== dto.passwordConfirm)
      throw new HttpException('The passwords must match', 403);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const _payload = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };
    const _user = await this.usersService.create(_payload);
    const payload = this.tokenService.generatePayload(_user, Token.AT);
    const token = this.tokenService.sign(payload);
    payload.type = Token.RT;
    const refreshToken = this.tokenService.sign(payload);
    const user = {
      name: _user.name,
      email: _user.email,
      role: _user.role,
      authToken: token,
      refreshToken,
    };

    return user;
  }

  async signIn(dto: SignInDto): Promise<IUser> {
    const _user = await this.usersService.getByEmail(dto.email);

    if (!_user) throw new HttpException('User not found', 404);
    if (!(await bcrypt.compare(dto.password, _user.password)))
      throw new UnauthorizedException();

    const payload = this.tokenService.generatePayload(_user, Token.AT);
    const token = this.tokenService.sign(payload);
    payload.type = Token.RT;
    const refreshToken = this.tokenService.sign(payload);
    const user = {
      name: _user.name,
      email: _user.email,
      role: _user.role,
      authToken: token,
      refreshToken,
    };

    return user;
  }

  refreshToken(request: Request): string {
    const token = request.header('refresh-token');
    const payload = this.tokenService.verify(token);
    delete payload.exp;
    delete payload.iat;
    payload.type = Token.AT;
    const authToken = this.tokenService.sign(payload);

    return authToken;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersService.getByEmail(email);

    if (!user) throw new HttpException('User not found', 404);

    const payload = this.tokenService.generatePayload(user, Token.PRT);
    const token = this.tokenService.sign(payload);
    const url = `${this.configService.get<string>('BASE_URL')}/auth/password-reset/${token}`;

    await this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_ADDRESS'),
      to: user.email,
      subject: 'Password Reset',
      text: url,
    });

    return true;
  }

  async passwordReset(dto: PasswordResetDto): Promise<boolean> {
    const token = this.request.params.token;
    const _payload = this.tokenService.verify(token);

    if (dto.password !== dto.passwordConfirm)
      throw new HttpException('The passwords must match', 403);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const payload = {
      userId: _payload.sub,
      password: hashedPassword,
    };
    await this.usersService.update(payload);

    return true;
  }
}
