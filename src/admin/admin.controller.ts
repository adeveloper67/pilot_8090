import { Controller, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {}
