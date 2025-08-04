import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './DTO/User.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('')
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.createUser(createUserDTO);
  }
  @Post('login')
  login(@Body() loginDTO: { email: string; password: string }) {
    return this.authService.login(loginDTO);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  test(@Request() req) {
    return { message: 'Auth module is working!', userData: req.user };
  }
}
