/**
 * RBAC Permissions Configuration (Frontend)
 * 
 * Mirror of backend permissions for client-side authorization checks.
 * Keep in sync with backend/src/shared/rbac/permissions.ts
 */

// Available roles in the system
export type Role = 'user' | 'admin';

// Resources that can be accessed
export type Resource = 
  | 'business'
  | 'category'
  | 'item'
  | 'profile'
  | 'user'
  | 'admin_dashboard';

// Actions that can be performed
export type Action = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage';

// Permission can be global or scoped to own resources
export type Permission = Action | `${Action}:own`;

// Permission matrix: role -> resource -> allowed permissions
export const PERMISSIONS: Record<Role, Partial<Record<Resource, Permission[]>>> = {
  // User (Business Owner)
  user: {
    business:        ['create', 'read:own', 'update:own', 'delete:own'],
    category:        ['create:own', 'read:own', 'update:own', 'delete:own'],
    item:            ['create:own', 'read:own', 'update:own', 'delete:own'],
    profile:         ['read:own', 'update:own'],
  },
  
  // Admin (Platform Admin)
  admin: {
    business:        ['create', 'read', 'update', 'delete', 'manage'],
    category:        ['create', 'read', 'update', 'delete', 'manage'],
    item:            ['create', 'read', 'update', 'delete', 'manage'],
    profile:         ['create', 'read', 'update', 'delete'],
    user:            ['create', 'read', 'update', 'delete', 'manage'],
    admin_dashboard: ['read', 'manage'],
  },
};

/**
 * Check if a role has a specific permission on a resource.
 */
export function hasPermission(
  role: Role,
  action: Action,
  resource: Resource,
  isOwn: boolean = false
): boolean {
  const permissions = PERMISSIONS[role]?.[resource];
  if (!permissions) return false;

  if (permissions.includes(action)) return true;
  if (permissions.includes('manage')) return true;
  if (isOwn && permissions.includes(`${action}:own` as Permission)) return true;

  return false;
}
