import { Injectable } from '@nestjs/common';
import { PropertyPurpose, PropertyStatus, PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPropertyDTO } from './DTO/createPropertyDTO.dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prismaService: PrismaService) {}
  async getProperties({
    userId,
    type,
    purpose,
    status,
    minPrice,
    maxPrice,
    location,
    search,
  }: {
    userId: number;
    type?: PropertyType;
    purpose?: PropertyPurpose;
    status?: PropertyStatus;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    search?: string;
  }) {
    const where: any = {
      customer: {
        userId, // ✅ Filter by current user's properties
      },
    };

    if (type) where.propertyType = type;
    if (purpose) where.propertyPurpose = purpose;
    if (status) where.propertyStatus = status;
    if (minPrice || maxPrice) {
      where.propertyPrice = {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      };
    }
    if (location) {
      where.propertyLocation = {
        contains: location,
      };
    }

    return this.prismaService.property.findMany({
      where,
      include: {
        images: { select: { url: true } },
        customer: { select: { name: true } },
      },
    });
  }
  async createProperty(userId: string, createPropertyDTO: createPropertyDTO) {
    const {
      title,
      description,
      propertyType,
      propertyPurpose,
      propertyPrice,
      propertyLocation,
      customerId,
      propertySize,
    } = createPropertyDTO;

    return this.prismaService.property.create({
      data: {
        title,
        description,
        propertyType,
        propertyPurpose,
        propertyStatus: PropertyStatus.AVAILABLE,
        propertyPrice,
        propertySize,
        propertyLocation,
        userId: +userId,
        customerId: +customerId, // Ensure customerId is a number
      },
      include: {
        images: true,
        customer: true,
      },
    });
  }
  async updateProperty(id: string, createPropertyDTO: createPropertyDTO) {
    const {
      title,
      description,
      propertyType,
      propertyPurpose,
      propertySize,
      propertyPrice,
      propertyLocation,
      customerId,
    } = createPropertyDTO;

    return this.prismaService.property.update({
      where: {
        id: +id, // Ensure id is a number
      },
      data: {
        title: title,
        description,
        propertyType,
        propertyPurpose,
        propertyStatus: PropertyStatus.AVAILABLE,
        propertyPrice,
        propertySize,
        propertyLocation,
        customerId: +customerId, // Ensure customerId is a number
      },
      include: {
        images: true,
        customer: true,
      },
    });
  }
  async deleteProperty(id: string) {
    return this.prismaService.property.delete({
      where: {
        id: +id, // Ensure id is a number
      },
    });
  }
  async getById(id: string) {
    return this.prismaService.property.findUnique({
      where: {
        id: +id, // Ensure id is a number
      },
    });
  }
  async getRelatedProperties(customerId: string, propertyPurpose: string) {
    return this.prismaService.property.findMany({
      where: {
        customerId: +customerId,
        propertyPurpose: propertyPurpose == 'RENT' ? 'RENTAL' : 'SALE',
      },
      select: {
        id: true,
        title: true,
      },
    });
  }
}
