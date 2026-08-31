import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@kisancall/shared-types';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    phone: string;
    role: UserRole;
  };
}

// Supabase Auth (phone OTP) middleware stub with role-based guard
export const authGuard = (allowedRoles: UserRole[]) => {
  return async (req: AuthenticatedRequest, reply: FastifyReply) => {
    // TODO: Verify Supabase JWT token from Authorization header and extract user role
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      reply.status(401).send({ error: 'Unauthorized: Missing token' });
      return;
    }

    // Stub mock user payload for scaffolding
    const userRole: UserRole = (req.headers['x-mock-role'] as UserRole) || 'farmer';
    
    if (!allowedRoles.includes(userRole)) {
      reply.status(403).send({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    req.user = {
      id: 'stub-user-id',
      phone: '+919876543210',
      role: userRole,
    };
  };
};
