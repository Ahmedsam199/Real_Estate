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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './DTO/CreateCustomer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerSerive: CustomerService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getCustomers(@Req() req, @Query('search') search) {
    return this.customerSerive.getCustomers(req.user.userId, search);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createCustomer(
    @Req() req,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.customerSerive.createCustomer(
      req.user.userId,
      createCustomerDto,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateCustomer(
    @Req() req,
    @Body() createCustomerDto: CreateCustomerDto,
    @Param('id') id: string,
  ) {
    // Logic to update customer will go here
    return this.customerSerive.updateCustomer(
      id,
      req.user.userId,
      createCustomerDto,
    );
  }
  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string) {
    // Logic to delete customer will go here
    return this.customerSerive.deleteCustomer(id);
  }
}
