export enum AppSubjects {
  User = 'User',
  Role = 'Role',

  All = 'all',
}

export enum AppActions {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',

  // ⚡ SUPER
  Manage = 'manage',
}

export const ALL_PERMISSIONS = [
  // User
  { name: `${AppActions.Read}:${AppSubjects.User}` },
  { name: `${AppActions.Create}:${AppSubjects.User}` },
  { name: `${AppActions.Update}:${AppSubjects.User}` },
  { name: `${AppActions.Delete}:${AppSubjects.User}` },

  // Role
  { name: `${AppActions.Read}:${AppSubjects.Role}` },
  { name: `${AppActions.Create}:${AppSubjects.Role}` },
  { name: `${AppActions.Update}:${AppSubjects.Role}` },
  { name: `${AppActions.Delete}:${AppSubjects.Role}` },
];

export const ADMIN_FULL_ACCESS = { action: AppActions.Manage, subject: 'all' };
