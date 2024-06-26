import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Token } from 'src/enums';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.header('refresh-token');

    if (!token) throw new UnauthorizedException();

    const payload = this.tokenService.verify(token);

    if (payload.type !== Token.RT) throw new UnauthorizedException();

    return true;
  }
}
