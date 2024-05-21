import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { Request } from 'express';

import { User } from 'src/schemas';
import { IPayload } from './interfaces';
import { Token } from 'src/enums';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generatePayload(user: User, type: string): IPayload {
    const payload = {
      sub: user._id as Types.ObjectId,
      type,
      role: user.role,
    };

    return payload;
  }

  sign(payload: IPayload): string {
    let exp = '1d';

    if (payload.type === Token.RT) exp = '7d';
    if (payload.type === Token.PRT) exp = '1h';

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: exp,
    });

    return token;
  }

  verify(token: string): IPayload {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return payload;
  }

  extractToken(request: Request): string | undefined {
    const [key, token] = request.headers.authorization?.split(' ') ?? [];

    return key === 'Bearer' ? token : undefined;
  }
}
