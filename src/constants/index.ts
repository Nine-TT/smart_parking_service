import { SetMetadata } from '@nestjs/common';

export const salt_Rounds = 10;

export const jwtConstants = {
  secret: 'bd87$^7gs',
};

export const userRole = {
  user: 'User',
  admin: 'Admin',
  manager: 'Manager',
};

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
