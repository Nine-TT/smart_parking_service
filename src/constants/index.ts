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

export const paking_location_state = {
  empty: 'EMPTY',
  blocked: 'BLOCKED',
  has_vehicle: 'HAS_VEHICLE',
  maintenance: 'MAINTENANCE',
  road: 'ROAD',
};

export const ticket_type = {
  monthlyTicket: 'MONTHLY',
  regularDayTicket: 'REGULAR_DAY',
  regularNightTicket: 'REGULAR_NIGHT',
};
