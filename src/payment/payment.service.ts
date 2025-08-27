import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdatePaymentDto } from './DTO/CreatetUpdatepayment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPayments(userId: number, contractId?: number) {
    const where: {
      userId: number;
      contractId?: number;
    } = {
      userId,
    };

    if (contractId) {
      where.contractId = contractId;
    }

    return this.prismaService.payment.findMany({
      where,
      include: {
        contract: {
          include: {
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });
  }

  async createPayment(
    userId: number,
    createPaymentDto: CreateUpdatePaymentDto,
  ) {
    const {
      contractId,
      amount,
      paymentStatus = PaymentStatus.PAID,
      paymentDate,
      paymentMethod,
      remarks,
    } = createPaymentDto;

    return this.prismaService.payment.create({
      data: {
        contractId,
        amount,
        paymentStatus,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        paymentMethod,
        remarks,
        userId,
      },
    });
  }

  async updatePayment(
    id: number,
    userId: number,
    updatePaymentDto: CreateUpdatePaymentDto,
  ) {
    const {
      contractId,
      amount,
      paymentStatus,
      paymentDate,
      paymentMethod,
      remarks,
    } = updatePaymentDto;

    return this.prismaService.payment.update({
      where: {
        id,
        userId, // Ensure user can only update their own payments
      },
      data: {
        contractId,
        amount,
        paymentStatus,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        paymentMethod,
        remarks,
      },
    });
  }

  async deletePayment(id: number, userId: number) {
    return this.prismaService.payment.delete({
      where: {
        id,
        userId, // Ensure user can only delete their own payments
      },
    });
  }

  async getPaymentById(id: number, userId: number) {
    return this.prismaService.payment.findFirst({
      where: {
        id,
        userId, // Ensure user can only access their own payments
      },
      include: {
        contract: {
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
        },
      },
    });
  }

  async getPaymentsByContract(contractId: number, userId: number) {
    return this.prismaService.payment.findMany({
      where: {
        contractId,
        userId, // Ensure user can only access their own payments
      },

      orderBy: {
        paymentDate: 'desc',
      },
    });
  }
}
