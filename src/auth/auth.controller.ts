import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { PasswordResetDto, SignInDto, SignUpDto } from './dto';
import { IUser } from './interfaces';
import {
  PasswordResetGuard,
  RefreshTokenGuard,
  GoogleOAuthGuard,
} from 'src/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  googleAuth() {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto): Promise<IUser> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() dto: SignInDto): Promise<IUser> {
    return this.authService.signIn(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string): Promise<boolean> {
    return this.authService.forgotPassword(email);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  refreshToken(@Req() request: Request): string {
    return this.authService.refreshToken(request);
  }

  @UseGuards(PasswordResetGuard)
  @Patch('password-reset/:token')
  passwordReset(@Body() dto: PasswordResetDto): Promise<boolean> {
    return this.authService.passwordReset(dto);
  }
}
