import {
  PermissionsArrayField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class CreateRoleReqDto {
  @StringField()
  name: string;

  @StringFieldOptional()
  description?: string;

  @PermissionsArrayField({
    description: 'List permission for Role',
    example: ['User:Read', 'User:Write'],
    required: true,
  })
  permissions: string[];
}
