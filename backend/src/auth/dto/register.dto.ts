import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';

import { Package, Role } from '@prisma/client';

export class RegisterDto {

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsIn(['FREE', 'PRO'])
  package!: Package;

  @IsOptional()
  role?: Role;
}