import { PostEntity } from '@/api/post/entities/post.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { SYSTEM_ROLE_NAME } from '@/constants/app.constant';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AppActions, AppSubjects } from './permissions.constant';

export type Subjects =
  | InferSubjects<typeof UserEntity | typeof PostEntity>
  | AppSubjects
  | 'all';
export type AppAbility = PureAbility<[string, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.role?.name === SYSTEM_ROLE_NAME) {
      can(AppActions.Manage, AppSubjects.All);
    } else {
      const perms = user.role?.permissions || [];
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
