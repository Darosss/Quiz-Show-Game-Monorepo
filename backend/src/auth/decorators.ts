import { SetMetadata } from '@nestjs/common';
import { RolesUser } from 'src/shared';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesUser[]) => SetMetadata(ROLES_KEY, roles);

export const RolesAdminGuard = () => Roles(RolesUser.Admin);
export const RolesSuperAdminGuard = () => Roles(RolesUser.SuperAdmin);

export const RolesAdminSuperAdminGuard = () =>
  Roles(RolesUser.Admin, RolesUser.SuperAdmin);
