import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';
import { GoogleStrategyService } from './google-strategy.service';

@Module({
  imports: [TokenModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategyService],
})
export class AuthModule {}
