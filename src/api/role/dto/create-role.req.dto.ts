import {
  PermissionsArrayField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class CreateRoleReqDto {
  @StringField({ example: 'STAFF' })
  name: string;

  @StringFieldOptional()
  description?: string;

  @PermissionsArrayField({
    example: ['read:User', 'create:User'],
  })
  permissions: string[];
}
