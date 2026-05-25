import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const totalPhotos = await this.prisma.photo.count();

    const totalUsers = await this.prisma.user.count();

    return {
      totalPhotos,
      totalUsers,
    };
  }
}