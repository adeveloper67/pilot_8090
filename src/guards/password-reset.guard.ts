import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Token } from 'src/enums';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class PasswordResetGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    if (!token) throw new UnauthorizedException();

    const payload = this.tokenService.verify(token);

    if (payload.type !== Token.PRT) throw new UnauthorizedException();

    return true;
  }
}
