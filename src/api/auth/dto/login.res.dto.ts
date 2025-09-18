import { LoginScope } from '@/constants/app.constant';
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
  @EnumField(() => LoginScope)
  scope: 'portal' | 'client';

  @Expose()
  @NumberField()
  tokenExpires!: number;
}
