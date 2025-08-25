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
import { ContractService } from './contract.service';
import { CreateUpdateContractDto } from './DTO/CreateUpdateContract.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}
  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async getContracts(@Req() req, @Query('customerId') customerId: string) {
    const userId = req.user.userId;
    return this.contractService.getContracts(userId, customerId);
  }
  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async createContract(
    @Req() req,
    @Body() contractDTO: CreateUpdateContractDto,
  ) {
    const userId = req.user.userId;
    return this.contractService.createContract(contractDTO, userId);
  }
  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async editContract(
    @Req() req,
    @Body() contractDTO: CreateUpdateContractDto,
    @Param('id') id,
  ) {
    const userId = req.user.userId;
    return this.contractService.editContract(contractDTO, userId, id);
  }
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteContract(@Param('id') id) {
    return this.contractService.deleteContract(id);
  }
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getContractById(@Param('id') id) {
    return this.contractService.getContractById(id);
  }
}
