import { Controller, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {}
