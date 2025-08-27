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

    // Parse and validate date range
    const dateFrom = from
      ? new Date(from)
      : new Date(new Date().getFullYear(), 0, 1); // Start of current year
    const dateTo = to ? new Date(to) : new Date(); // Today

    // Build contract filters
    const contractFilters: any = {
      userId: +userId,
    };

    if (customerId) {
      contractFilters.customerId = +customerId;
    }

    if (contractId) {
      contractFilters.contractId = +contractId;
    }

    // Contract date filtering - assuming you want contracts active during the period
    // (contracts that overlap with the date range)
    contractFilters.AND = [
      { startDate: { lte: dateTo } }, // Contract starts before or on end date
      { endDate: { gte: dateFrom } }, // Contract ends after or on start date
    ];

    // Fetch contracts with related data
    const contracts = await this.prismaSerivce.contract.findMany({
      where: contractFilters,
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

    // Process each contract individually
    const result = await Promise.all(
      contracts.map(async (contract) => {
        // Get paid payments for THIS specific contract within the date range
        const paidPayments = await this.prismaSerivce.payment.findMany({
          where: {
            contractId: contract.id, // Filter by specific contract, not all contractIds
            paymentStatus: PaymentStatus.PAID,
            paymentDate: {
              gte: dateFrom,
              lte: dateTo,
            },
          },
          orderBy: {
            paymentDate: 'asc',
          },
        });

        // Calculate months between contract start/end dates, constrained by filter dates
        const effectiveStartDate = new Date(
          Math.max(
            contract.startDate?.getTime() ?? dateFrom.getTime(),
            dateFrom.getTime(),
          ),
        );
        const effectiveEndDate = new Date(
          Math.min(
            contract.endDate?.getTime() ?? dateTo.getTime(),
            dateTo.getTime(),
          ),
        );

        const months = getMonthsBetween(effectiveStartDate, effectiveEndDate);
        const data: any[] = [];
        let DueAmount = 0;

        for (const { month, year } of months) {
          const monthDate = makeDateFromMonthYear(month, year);

          // Only process months that have already passed
          if (new Date() >= monthDate) {
            // Find payment for this specific month
            const paymentForMonth = paidPayments.find((payment) =>
              isDateInMonth(new Date(payment.paymentDate), month, year),
            );

            const paidAmount = paymentForMonth?.amount || 0;
            const fullPaid = paidAmount >= contract.amount;

            if (!fullPaid) {
              const dueForMonth = contract.amount - paidAmount;
              DueAmount += dueForMonth;
            }

            data.push({
              ...paymentForMonth,
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
