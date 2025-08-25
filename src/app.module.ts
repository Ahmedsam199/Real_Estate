import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { PropertyModule } from './property/property.module';
import { ContractModule } from './contract/contract.module';
import { PaymentModule } from './payment/payment.module';
import { ReportModule } from './report/report.module';
import { PrintSettingModule } from './print-setting/print-setting.module';

@Module({
  imports: [AuthModule, CustomerModule, PropertyModule, ContractModule, PaymentModule, ReportModule, PrintSettingModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService],
})
export class AppModule {}
