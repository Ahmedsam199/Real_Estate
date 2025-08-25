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

import { PropertyService } from './property.service';
import { createPropertyDTO } from './DTO/createPropertyDTO.dto';
import { PropertyPurpose, PropertyStatus, PropertyType } from '@prisma/client';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getProperty(
    @Req() req,
    @Query('type') type?: PropertyType,
    @Query('purpose') purpose?: PropertyPurpose,
    @Query('status') status?: PropertyStatus,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('location') location?: string,
    @Query('search') search?: string,
  ) {
    return this.propertyService.getProperties({
      userId: req.user.userId,
      type,
      purpose,
      status,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location,
      search,
    });
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createProperty(
    @Req() req,
    @Body() createPropertyDTO: createPropertyDTO,
  ) {
    return this.propertyService.createProperty(
      req.user.userId,
      createPropertyDTO,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateProperty(
    @Req() req,
    @Body() updatePropertyDTO: createPropertyDTO,
    @Param('id') id: string,
  ) {
    // Logic to update customer will go here
    return this.propertyService.updateProperty(id, updatePropertyDTO);
  }
  @Get('/related')
  async getRelatedProperties(
    @Query('customerId') customerId: string,
    @Query('propertyPurpose') propertyPurpose: string,
  ) {
    // Logic to delete customer will go here
    return this.propertyService.getRelatedProperties(
      customerId,
      propertyPurpose,
    );
  }
  @Delete('/:id')
  async deleteProperty(@Param('id') id: string) {
    // Logic to delete customer will go here
    return this.propertyService.deleteProperty(id);
  }
  @Get('/:id')
  async getById(@Param('id') id: string) {
    // Logic to delete customer will go here
    return this.propertyService.getById(id);
  }
}
