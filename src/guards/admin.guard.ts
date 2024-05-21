import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from 'src/token/token.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.tokenService.extractToken(request);

    if (!token) throw new UnauthorizedException();

    const payload = this.tokenService.verify(token);

    if (!payload) throw new UnauthorizedException();
    if (payload.role !== 'admin') throw new UnauthorizedException();

    return true;
  }
}
