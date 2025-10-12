import { ArrayField } from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationLinksDto } from './pagination-links.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class NestJsPaginated<T> {
  @ArrayField([Object])
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  @ApiProperty({ type: PaginationLinksDto })
  links: PaginationLinksDto;
}
