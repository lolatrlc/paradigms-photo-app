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

    const photos = await this.prisma.photo.findMany();

    const hashtagCount: Record<string, number> = {};

    photos.forEach((photo) => {

    photo.hashtags.forEach((tag) => {

        hashtagCount[tag] =
        (hashtagCount[tag] || 0) + 1;
    });
    });

    let mostUsedHashtag = 'None';

    let maxCount = 0;

    for (const tag in hashtagCount) {

    if (hashtagCount[tag] > maxCount) {

        maxCount = hashtagCount[tag];

        mostUsedHashtag = tag;
    }
    }

    return {
        totalPhotos,
        totalUsers,
        freeUsers,
        proUsers,
        uploadsToday,
        mostUsedHashtag,
    };
    }
}