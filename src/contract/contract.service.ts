import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdateContractDto } from './DTO/CreateUpdateContract.dto';

@Injectable()
export class ContractService {
  constructor(private readonly prismaService: PrismaService) {}
  async getContracts(userId: string, customerId: string) {
    const where = {};
    where['userId'] = +userId;
    if (customerId) where['customerId'] = +customerId;
    return this.prismaService.contract.findMany({
      where: where,
      include: {
        property: {
          select: {
            title: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        contractDate: 'desc',
      },
    });
  }
  async createContract(
    createContract: CreateUpdateContractDto,
    userId: number,
  ) {
    return this.prismaService.contract.create({
      data: {
        userId,
        propertyId: createContract.propertyId,
        customerId: createContract.customerId,
        contractType: createContract.contractType,
        amount: createContract.amount,
        commission: createContract.commission ?? null,
        contractDate: createContract.contractDate
          ? new Date(createContract.contractDate)
          : undefined, // Not nullable in Prisma, so can be undefined
        startDate: createContract.startDate
          ? new Date(createContract.startDate)
          : null,
        endDate: createContract.endDate
          ? new Date(createContract.endDate)
          : null,
      },
    });
  }
  async editContract(
    createContract: CreateUpdateContractDto,
    userId: number,
    id: string,
  ) {
    return this.prismaService.contract.update({
      where: {
        id: +id,
      },
      data: {
        userId,
        propertyId: createContract.propertyId,
        customerId: createContract.customerId,
        contractType: createContract.contractType,
        amount: createContract.amount,
        commission: createContract.commission ?? null,
        contractDate: createContract.contractDate
          ? new Date(createContract.contractDate)
          : undefined, // Not nullable in Prisma, so can be undefined
        startDate: createContract.startDate
          ? new Date(createContract.startDate)
          : null,
        endDate: createContract.endDate
          ? new Date(createContract.endDate)
          : null,
      },
    });
  }
  async deleteContract(id: string) {
    return this.prismaService.contract.delete({
      where: {
        id: +id,
      },
    });
  }
  async getContractById(id: string) {
    return this.prismaService.contract.findUnique({
      where: {
        id: +id,
      },
    });
  }
}
