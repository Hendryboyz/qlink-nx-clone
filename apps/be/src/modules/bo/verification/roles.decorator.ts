import { SetMetadata } from '@nestjs/common';
import { BoRole } from '@org/types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: BoRole[]) => SetMetadata(ROLES_KEY, roles);
export const AllAuthenticated = () =>
  SetMetadata(ROLES_KEY, Object.values(BoRole));
