import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { PaymentService } from './payment.service';

interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}
import { CreateUpdatePaymentDto } from './DTO/CreatetUpdatepayment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getPayments(
    @Req() req: RequestWithUser,
    @Query('contractId') contractId?: string,
  ) {
    return this.paymentService.getPayments(
      req.user.userId,
      contractId ? Number(contractId) : undefined,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createPayment(
    @Req() req: RequestWithUser,
    @Body() createPaymentDto: CreateUpdatePaymentDto,
  ) {
    return this.paymentService.createPayment(req.user.userId, createPaymentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updatePayment(
    @Req() req: RequestWithUser,
    @Body() updatePaymentDto: CreateUpdatePaymentDto,
    @Param('id') id: string,
  ) {
    return this.paymentService.updatePayment(
      Number(id),
      req.user.userId,
      updatePaymentDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deletePayment(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.paymentService.deletePayment(Number(id), req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getPaymentById(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.paymentService.getPaymentById(Number(id), req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/contract/:contractId')
  async getPaymentsByContract(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
  ) {
    return this.paymentService.getPaymentsByContract(
      Number(contractId),
      req.user.userId,
    );
  }
}
