import { ESessionLoginScope } from '@/constants/entity.enum';
import {
  EnumField,
  NumberField,
  StringField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginResDto {
  @Expose()
  @StringField()
  userId!: string;

  @Expose()
  @StringField()
  accessToken!: string;

  @Expose()
  @StringField()
  refreshToken!: string;

  @Expose()
  @EnumField(() => ESessionLoginScope)
  scope: ESessionLoginScope;

  @Expose()
  @NumberField()
  tokenExpires!: number;
}
