import { SetMetadata } from '@nestjs/common';
import { BoRole } from '@org/types';

export const Roles = (...roles: BoRole[]) => SetMetadata('roles', roles);
export const AllAuthenticated = () =>
  SetMetadata('roles', Object.values(BoRole));
