import { Role, Package } from '@prisma/client';

export class RegisterDto {
  email!: string;
  password!: string;
  role?: Role;
  package!: Package;
}
