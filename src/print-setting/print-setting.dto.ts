import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsObject,
} from 'class-validator';

export class PrintSettingDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  html: string;
  @IsNotEmpty()
  @IsObject()
  printSetting: object;
}
