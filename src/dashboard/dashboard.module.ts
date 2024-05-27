import { Module } from '@nestjs/common';

import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
})
export class DashboardModule {}
