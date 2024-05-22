import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
