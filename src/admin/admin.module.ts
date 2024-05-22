import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [AdminController],
})
export class AdminModule {}
