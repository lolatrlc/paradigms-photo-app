import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreatePhotoDto {

  @IsNotEmpty()
  title!: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  hashtags!: string;
}