import {
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class PaginationLinksDto {
  @StringField()
  first: string;

  @StringFieldOptional()
  previous?: string;

  @StringField()
  current: string;

  @StringFieldOptional()
  next?: string;

  @StringField()
  last: string;
}
