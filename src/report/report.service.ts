/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  getMonthsBetween,
  isDateInMonth,
  makeDateFromMonthYear,
} from 'src/utils/utils';

@Injectable()
export class ReportService {
  constructor(private readonly prismaSerivce: PrismaService) {}
  async getRentReport(params: {
    userId: number;
    from?: string;
    to?: string;
    customerId?: number;
    contractId?: number;
  }) {
    const { userId, from, to, customerId, contractId } = params;
    const parsedFrom = from
      ? new Date(from)
      : new Date(new Date().getFullYear(), 0, 1);
    const parsedTo = to ? new Date(to) : new Date();
    const extendedWhere: any = {};
    if (customerId) extendedWhere['customerId'] = +customerId;
    if (contractId) extendedWhere['contractId'] = +contractId;
    const contracts = await this.prismaSerivce.contract.findMany({
      where: {
        userId: +userId,
        ...extendedWhere,
        AND: [
          { startDate: { gte: parsedFrom } },
          { endDate: { lte: parsedTo } },
        ],
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        property: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const contractIds = contracts.map((c) => c.id);

    const result = await Promise.all(
      contracts.map(async (contract) => {
        const paidPayments = await this.prismaSerivce.payment.findMany({
          where: {
            contractId: { in: contractIds },
            paymentStatus: PaymentStatus.PAID,
            AND: [
              { paymentDate: { gte: parsedFrom } },
              { paymentDate: { lte: parsedTo } },
            ],
          },
          orderBy: {
            paymentDate: 'asc',
          },
        });

        const months = getMonthsBetween(
          contract.startDate ?? new Date(),
          contract.endDate ?? new Date(),
        ); // [{month, year}, ...]
        const data: any[] = [];
        let DueAmount = 0;
        for (const { month, year } of months) {
          if (new Date() >= makeDateFromMonthYear(month, year)) {
            const paymentsForMonth = paidPayments.find((payment) =>
              isDateInMonth(new Date(payment.paymentDate), month, year),
            );
            const paidAmount = paymentsForMonth?.amount || 0;
            const fullPaid = paidAmount >= contract.amount;

            if (!fullPaid) {
              const dueForMonth = contract.amount - paidAmount;
              DueAmount += dueForMonth;
            }

            data.push({
              ...paymentsForMonth,
              month,
              year,
              fullPaid,
            });
          }
        }

        return {
          ...contract,
          DueAmount,
          data,
        };
      }),
    );

    return result;
  }
}
