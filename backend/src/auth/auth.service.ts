import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterDto) {

    //verif si l'utilisateur existe pas deja
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('This email is already registered');
    }

      const hashedPassword = await bcrypt.hash(data.password, 10);

    //cree le nouveau user
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        package: data.package,
        role: data.role || 'USER',
      },
    });
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    //génère le token avec l'ID, l'email et le package
    const payload = { sub: user.id, 
      email: user.email, 
      package: user.package,
      role: user.role,};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

}
