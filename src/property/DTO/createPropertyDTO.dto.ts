import { PropertyPurpose, PropertyStatus, PropertyType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class createPropertyDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsEnum(PropertyType)
  type: PropertyType;
  @IsNotEmpty()
  @IsEnum(PropertyPurpose)
  purpose: PropertyPurpose;
  status: PropertyStatus;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  peropertySize: number;
  @IsNotEmpty()
  location: string;
  @IsNotEmpty()
  customerId: string; // Optional, if the property is linked to a customer
}
