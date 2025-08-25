import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ReportService } from './report.service';

interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/rent')
  getRentReport(
    @Req() req: RequestWithUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('customerId') customerId?: string,
    @Query('contractId') contractId?: string,
  ) {
    return this.reportService.getRentReport({
      userId: req.user.userId,
      from,
      to,
      customerId: customerId ? Number(customerId) : undefined,
      contractId: contractId ? Number(contractId) : undefined,
    });
  }
}
