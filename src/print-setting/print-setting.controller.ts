import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrintSettingService } from './print-setting.service';
import { AuthGuard } from '@nestjs/passport';
import { PrintSettingDTO } from './print-setting.dto';
import { RequestWithUser } from 'src/utils/utils';

@Controller('print-setting')
export class PrintSettingController {
  constructor(private readonly printSettingService: PrintSettingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getAllPrintSettings(@Req() req: RequestWithUser) {
    return this.printSettingService.getAllPrintsSettings(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createPrintSetting(
    @Req() req: RequestWithUser,
    @Body() printDTO: PrintSettingDTO,
  ) {
    return this.printSettingService.createNewPrinteSetting(
      req.user.userId,
      printDTO,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updatePrintSetting(
    @Req() req: RequestWithUser,
    @Body() printDTO: PrintSettingDTO,
    @Param('id') id: string,
  ) {
    return this.printSettingService.updatePrintSettings(
      req.user.userId,
      printDTO,
      +id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deletePrintSetting(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.printSettingService.deletePrintSetting(+id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getPrintSettingById(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.printSettingService.getPrintSettingById(+id, req.user.userId);
  }
}
