import { PostEntity } from '@/api/post/entities/post.entity';
import { RoleEntity } from '@/api/role/entities/role.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { SYSTEM_ROLE_NAME } from '@/constants/app.constant';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AppActions, AppSubjects } from '../../utils/permissions.constant';

export type Subjects =
  | InferSubjects<typeof UserEntity | typeof PostEntity | typeof RoleEntity>
  | AppSubjects
  | 'all';
// export type AppAbility = PureAbility<[string, Subjects]>;
export type AppAbility = MongoAbility<[AppActions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

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
