import { Admin } from '@/api/admin/entities/admin.entity';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AppActions, AppSubjects } from './permissions.constant';

export type Subjects = InferSubjects<typeof Admin> | AppSubjects | 'all';
export type AppAbility = PureAbility<[string, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForAdmin(admin: Admin) {
    const { can, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (admin.role?.name === 'admin') {
      can(AppActions.Manage, AppSubjects.All);
    } else {
      const perms = admin.role?.permissions || [];
      perms.forEach((perm) => {
        const [action, subject] = perm.split(':');
        if (action && subject) {
          can(action as AppActions, subject as AppSubjects);
        }
      });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
