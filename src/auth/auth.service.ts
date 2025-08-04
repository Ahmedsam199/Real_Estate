import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './DTO/User.dto';
import { PasswordHelper } from 'src/utils/passwordHelper';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDTO: CreateUserDTO) {
    const hashedPassword = await PasswordHelper.hashPassword(
      createUserDTO.password,
    );

    const user = await this.prismaService.user.create({
      data: {
        ...createUserDTO,
        password: hashedPassword,
      },
    });

    return user;
  }
  async login(loginDTO: { email: string; password: string }) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDTO.email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatch = await PasswordHelper.comparePasswords(
      loginDTO.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const payload = { email: user.email, sub: user.id };

    return { ...user, ...payload, access_token: this.jwtService.sign(payload) };
  }
}
