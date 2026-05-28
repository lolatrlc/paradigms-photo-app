import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PHOTO_LIMITS } from './photo-limits';
import * as fs from 'node:fs'; // Utilise le préfixe node:
import { unlink } from 'node:fs/promises';
import { Response } from 'express';


@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async delete(id: number, userId: number, userRole: string) {
  if (isNaN(id)) {
    throw new BadRequestException('Invalid photo id');
  }

  const photo = await this.prisma.photo.findUnique({ where: { id } });
  
  if (!photo) throw new NotFoundException();

  if (userRole !== 'ADMIN' && photo.userId !== userId) {
    throw new ForbiddenException("You are not allowed to delete this photo.");
  }

  try {
    if (photo.url && fs.existsSync(photo.url)) {
      await unlink(photo.url);
      console.log(`File ${photo.url} deleted from the disk.`);
    }
  } catch (err) {
    console.error("Error occurred while deleting the file:", err);
  }

  return this.prisma.photo.delete({
    where: { id },
  });
}

  async getAll(
    userId: number,
    userRole: string,
    author?: string,
    hashtag?: string,
  ) {
    const filters: any = {};

    // USER → seulement ses photos
    if (userRole !== 'ADMIN') {
      filters.userId = userId;
    }

    // filtre auteur
    if (author) {
      filters.author = {
        email: {
          contains: author,
          mode: 'insensitive',
        },
      };
    }

    // filtre hashtag
    if (hashtag) {
      filters.hashtags = {
        has: hashtag,
      };
    }

    return this.prisma.photo.findMany({
      where: filters,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: { title: string; description?: string; hashtags: string[]; url: string; userId: number }, userPackage: string) {
    
    // --- LOGIQUE DE LIMITE (OUTCOME O5) ---
    
    //Déf la limite
    const limit = PHOTO_LIMITS[userPackage as keyof typeof PHOTO_LIMITS];

    //récup toutes les photos de cet utilisateur
    const userPhotos = await this.prisma.photo.findMany({
      where: { userId: data.userId },
    });

    //isoler les photos créées aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0); //On se place à minuit ce matin

    const photosToday = userPhotos.filter((photo) => {
      return new Date(photo.createdAt) >= today;
    });

    if (photosToday.length >= limit) {
      throw new BadRequestException(
        `Limit reached : Your package ${userPackage} only allows ${limit} photos per day.`
      );
    }

    return this.prisma.photo.create({
      data: {
        title: data.title,
        description: data.description ?? '',
        hashtags: data.hashtags,
        url: data.url,
        userId: data.userId,
      },
    });
  }

  async getPublicPhotos() {
  return this.prisma.photo.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async downloadPhoto(id: number, res: Response) {
  const photo = await this.prisma.photo.findUnique({
    where: { id },
  });

  if (!photo) {
    throw new NotFoundException('Photo not found');
  }

  return res.download(photo.url);
}

async update(
    id: number,
    body: {
      title: string;
      description?: string;
      hashtags: string;
    },
    userId: number,
    userRole: string,
  ) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // USER → seulement ses photos
    if (userRole !== 'ADMIN' && photo.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to edit this photo.',
      );
    }

    return this.prisma.photo.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description ?? '',
        hashtags: body.hashtags.split(','),
      },
    });
  }
  
}



