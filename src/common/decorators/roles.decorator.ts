import { SetMetadata } from '@nestjs/common';

/**
 * use {@Roles} instead of {@setMetadata} on every REST entrypoint
 *
 * @param {...string[]} roles
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
