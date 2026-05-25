import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const totalPhotos = await this.prisma.photo.count();

    const totalUsers = await this.prisma.user.count();

    const freeUsers = await this.prisma.user.count({
        where: {
        package: 'FREE',
        },
    });

    const proUsers = await this.prisma.user.count({
        where: {
        package: 'PRO',
        },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uploadsToday = await this.prisma.photo.count({
        where: {
        createdAt: {
            gte: today,
        },
        },
    });

    return {
        totalPhotos,
        totalUsers,
        freeUsers,
        proUsers,
        uploadsToday,
    };
    }
}