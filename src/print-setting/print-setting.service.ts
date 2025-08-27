import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrintSettingDTO } from './print-setting.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrintSettingService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllPrintsSettings(userId: number) {
    try {
      return this.prismaService.printSettings.findMany({
        where: { userId },
      });
    } catch (error) {
      return { message: 'Error fetching printers' };
    }
  }
  async createNewPrinteSetting(userId: number, printDTO: PrintSettingDTO) {
    try {
      return this.prismaService.printSettings.create({
        data: {
          ...printDTO,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Print setting already exists',
            HttpStatus.FORBIDDEN,
          );
        }
      }
      throw new HttpException(
        'Error creating print setting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updatePrintSettings(
    userId: number,
    printDTO: PrintSettingDTO,
    id: number,
  ) {
    try {
      return this.prismaService.printSettings.update({
        where: { id },
        data: {
          ...printDTO,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Print setting already exists',
            HttpStatus.FORBIDDEN,
          );
        }
      }
      throw new HttpException(
        'Error creating print setting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async deletePrintSetting(printSettingId: number, userId: number) {
    try {
      // Optional: ensure the user owns this print setting
      const existing = await this.prismaService.printSettings.findUnique({
        where: { id: printSettingId },
      });

      if (!existing) {
        throw new HttpException(
          'Print setting not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (existing.userId !== userId) {
        throw new HttpException(
          'You do not have permission to delete this print setting',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.prismaService.printSettings.delete({
        where: { id: printSettingId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors if needed
        return new HttpException(
          'Database error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Error deleting print setting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getPrintSettingById(printSettingId: number, userId: number) {
    try {
      const printSetting = await this.prismaService.printSettings.findUnique({
        where: { id: printSettingId },
      });

      if (!printSetting) {
        throw new HttpException(
          'Print setting not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Optional: check ownership if print settings are user-specific
      if (printSetting.userId !== userId) {
        throw new HttpException(
          'You do not have permission to access this print setting',
          HttpStatus.FORBIDDEN,
        );
      }

      return printSetting;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return new HttpException(
          'Database error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Error retrieving print setting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
