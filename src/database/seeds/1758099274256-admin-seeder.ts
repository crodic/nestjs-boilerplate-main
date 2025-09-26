import { RoleEntity } from '@/api/role/entities/role.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import {
  SUPER_ADMIN_ACCOUNT,
  SYSTEM_ROLE_NAME,
  SYSTEM_USER_ID,
} from '@/constants/app.constant';
import { EUserLoginProvider } from '@/constants/entity.enum';
import { AppActions, AppSubjects } from '@/utils/permissions.constant';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class AdminSeeder1758099274256 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(RoleEntity);
    const userRepo = dataSource.getRepository(UserEntity);

    const permissions = [`${AppActions.Manage}:${AppSubjects.All}`];

    let superAdminRole = await roleRepo.findOne({
      where: { name: SYSTEM_ROLE_NAME },
    });

    if (!superAdminRole) {
      superAdminRole = roleRepo.create({
        name: SYSTEM_ROLE_NAME,
        permissions,
        createdBy: SYSTEM_USER_ID,
        updatedBy: SYSTEM_USER_ID,
      });
      await roleRepo.save(superAdminRole);
    } else {
      superAdminRole.permissions = permissions;
      superAdminRole.updatedBy = SYSTEM_USER_ID;
      await roleRepo.save(superAdminRole);
    }

    const existingAdmin = await userRepo.findOne({
      where: { email: SUPER_ADMIN_ACCOUNT.email },
    });

    if (!existingAdmin) {
      const admin = userRepo.create({
        email: SUPER_ADMIN_ACCOUNT.email,
        password: SUPER_ADMIN_ACCOUNT.password,
        role: superAdminRole,
        username: SUPER_ADMIN_ACCOUNT.username,
        provider: EUserLoginProvider.LOCAL,
        providerId: SUPER_ADMIN_ACCOUNT.email,
        createdBy: SYSTEM_USER_ID,
        updatedBy: SYSTEM_USER_ID,
      });
      await userRepo.save(admin);
    }
  }
}
