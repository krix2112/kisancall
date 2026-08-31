import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole, AuthenticatedUser } from '@kisancall/shared-types';
import { supabase } from './supabase.js';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: AuthenticatedUser;
}

/**
 * Auth middleware: verifies Supabase JWT and checks role against allowedRoles.
 *
 * Flow:
 * 1. Extract JWT from Authorization: Bearer <token>
 * 2. Verify via supabase.auth.getUser(token) — rejects expired/invalid tokens
 * 3. Look up application role from user_roles table
 * 4. Reject 403 if role not in allowedRoles
 * 5. Attach verified user to req.user
 *
 * No stub user objects — req.user always comes from the verified token.
 */
export const authGuard = (allowedRoles: UserRole[]) => {
  return async (req: AuthenticatedRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.status(401).send({
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization header. Expected: Bearer <token>',
      });
      return;
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Verify the JWT with Supabase Auth
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData?.user) {
      reply.status(401).send({
        error: 'Unauthorized',
        message: authError?.message || 'Invalid or expired token',
      });
      return;
    }

    const authUser = userData.user;

    // Look up application role from user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('auth_user_id', authUser.id)
      .single();

    if (roleError || !roleData) {
      reply.status(403).send({
        error: 'Forbidden',
        message: 'No application role assigned to this user. Contact an administrator.',
      });
      return;
    }

    const userRole = roleData.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      reply.status(403).send({
        error: 'Forbidden',
        message: `Role '${userRole}' is not authorized for this endpoint. Required: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    // Attach verified user — no stubs, every field from the real token/DB
    req.user = {
      id: authUser.id,
      phone: authUser.phone || '',
      role: userRole,
    };
  };
};
