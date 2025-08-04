import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './DTO/CreateCustomer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}
  async getCustomers(userId: string): Promise<any> {
    // Logic to retrieve customers for the given user ID
    return this.prismaService.customer.findMany({
      where: {
        userId: +userId,
      },
    });
  }
  async createCustomer(
    userId: string,
    createCustomerDto: CreateCustomerDto,
  ): Promise<any> {
    // Logic to create a new customer for the given user ID
    return this.prismaService.customer.create({
      data: {
        ...createCustomerDto,
        userId: +userId,
      },
    });
  }
  async updateCustomer(
    id: string,
    userId: string,
    createCustomerDto: CreateCustomerDto,
  ): Promise<any> {
    // Logic to update an existing customer for the given user ID
    return this.prismaService.customer.update({
      where: {
        id: +id,
      },
      data: { ...createCustomerDto, userId: +userId },
    });
  }
  async deleteCustomer(id: string): Promise<any> {
    // Logic to delete a customer by ID
    return this.prismaService.customer.delete({
      where: {
        id: +id,
      },
    });
  }
}
