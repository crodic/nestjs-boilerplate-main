import {
  ArrayField,
  JsonFieldOptional,
  NumberField,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class PaginationMetaDto {
  @NumberField()
  itemsPerPage: number;

  @NumberField()
  totalItems: number;

  @NumberField()
  currentPage: number;

  @NumberField()
  totalPages: number;

  @ArrayField(String, { example: [['id', 'DESC']] })
  sortBy: [string, string][];

  @StringFieldOptional()
  search?: string;

  @JsonFieldOptional()
  filter?: Record<string, any>;
}
