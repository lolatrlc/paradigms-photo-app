import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Req,
  Delete,
  Param,
  Query,
  Res,
  Patch
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { LoggerInterceptor } from '../common/interceptors/logger.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Response } from 'express';
import { extname } from 'path';

@Controller('photos')
@UseInterceptors(LoggerInterceptor)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Req() req: any,
    @Query('author') author?: string,
    @Query('hashtag') hashtag?: string,
  ) {
    return this.photosService.getAll(
    req.user.userId,
    req.user.role,
    author,
    hashtag,
  );
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueName =
          Date.now() + extname(file.originalname);

        callback(null, uniqueName);
      },
    }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreatePhotoDto,
    @Req() req: any
  ) {
    return this.photosService.create({
      title: body.title,
      description: body.description ?? '',
      hashtags: body.hashtags.split(','),
      url: file.path,
      userId: req.user.userId,
    }, req.user.package);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async remove(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.photosService.delete(
      Number(id),
      req.user.userId,
      req.user.role
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async updatePhoto(
    @Param('id') id: string,
    @Body() body: CreatePhotoDto,
    @Req() req: any,
  ) {
    return this.photosService.update(
      Number(id),
      body,
      req.user.userId,
      req.user.role,
    );
  }

  @Get('download/:id')
  async downloadPhoto(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.photosService.downloadPhoto(Number(id), res);
  }

  @Get('public')
  async getPublicPhotos() {
    return this.photosService.getPublicPhotos();
}
}