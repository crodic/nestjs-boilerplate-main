import { Admin } from '@/api/admin/entities/admin.entity';
import { Role } from '@/api/admin/entities/role.entity';
import {
  SUPER_ADMIN_ACCOUNT,
  SYSTEM_ROLE_NAME,
} from '@/constants/app.constant';
import { hashPassword } from '@/utils/password.util';
import { ALL_PERMISSIONS } from '@/utils/permissions.constant';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class AdminSeeder1758099274256 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(Role);
    const userRepo = dataSource.getRepository(Admin);

    const permissions = ALL_PERMISSIONS.map((p) => p.name);

    let superAdminRole = await roleRepo.findOne({
      where: { name: SYSTEM_ROLE_NAME },
    });

    if (!superAdminRole) {
      superAdminRole = roleRepo.create({ name: SYSTEM_ROLE_NAME, permissions });
      await roleRepo.save(superAdminRole);
    } else {
      superAdminRole.permissions = permissions;
      await roleRepo.save(superAdminRole);
    }

    const existingAdmin = await userRepo.findOne({
      where: { email: SUPER_ADMIN_ACCOUNT.email },
    });

    if (!existingAdmin) {
      const admin = userRepo.create({
        email: SUPER_ADMIN_ACCOUNT.email,
        password: await hashPassword(SUPER_ADMIN_ACCOUNT.password),
        role: superAdminRole,
        isActive: true,
        username: SUPER_ADMIN_ACCOUNT.username,
      });
      await userRepo.save(admin);
    }
  }
}
