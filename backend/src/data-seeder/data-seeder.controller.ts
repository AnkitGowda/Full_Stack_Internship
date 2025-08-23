import { Controller, Post, UseGuards } from '@nestjs/common';
import { DataSeederService } from './data-seeder.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('seed')
@UseGuards(JwtAuthGuard)
export class DataSeederController {
  constructor(private dataSeederService: DataSeederService) {}

  @Post('dummy-data')
  async seedDummyData() {
    return this.dataSeederService.seedDummyData();
  }
}