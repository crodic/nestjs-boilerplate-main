import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { buildPaginator } from '@/utils/cursor-pagination';
import { paginate } from '@/utils/offset-pagination';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { assert } from 'console';
import { Repository } from 'typeorm';
import { AuditLogResDto } from './dto/audit-log.res.dto';
import { ListAuditLogReqDto } from './dto/list-audit-log.req.dto';
import { LoadMoreAuditLogsReqDto } from './dto/load-more-audit-logs.req.dto';
import { AuditLogEntity } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async findAll(
    reqDto: ListAuditLogReqDto,
  ): Promise<OffsetPaginatedDto<AuditLogResDto>> {
    const query = this.auditLogRepository
      .createQueryBuilder('audit-log')
      .orderBy('audit-log.createdAt', 'DESC');
    const [users, metaDto] = await paginate<AuditLogEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(
      plainToInstance(AuditLogResDto, users),
      metaDto,
    );
  }

  async loadMoreAuditLogs(
    reqDto: LoadMoreAuditLogsReqDto,
  ): Promise<CursorPaginatedDto<AuditLogResDto>> {
    const queryBuilder =
      this.auditLogRepository.createQueryBuilder('audit-log');
    const paginator = buildPaginator({
      entity: AuditLogEntity,
      alias: 'audit-log',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(
      plainToInstance(AuditLogResDto, data),
      metaDto,
    );
  }

  async findOne(id: Uuid): Promise<AuditLogResDto> {
    assert(id, 'id is required');
    const log = await this.auditLogRepository.findOneByOrFail({ id });

    return plainToInstance(AuditLogResDto, log);
  }
}
