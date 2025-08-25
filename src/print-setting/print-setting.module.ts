import { Module } from '@nestjs/common';
import { PrintSettingController } from './print-setting.controller';
import { PrintSettingService } from './print-setting.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PrintSettingController],
  providers: [PrintSettingService, PrismaService],
})
export class PrintSettingModule {}
