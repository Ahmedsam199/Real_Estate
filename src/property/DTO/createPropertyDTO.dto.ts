import { PropertyPurpose, PropertyStatus, PropertyType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class createPropertyDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;
  @IsNotEmpty()
  @IsEnum(PropertyPurpose)
  propertyPurpose: PropertyPurpose;
  propertyStatus: PropertyStatus;
  @IsNotEmpty()
  @IsNumber()
  propertyPrice: number;
  @IsNotEmpty()
  @IsNumber()
  propertySize: number;
  @IsNotEmpty()
  propertyLocation: string;
  @IsNotEmpty()
  customerId: string; // Optional, if the property is linked to a customer
}
