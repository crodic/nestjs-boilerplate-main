import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { buildPaginator } from '@/utils/cursor-pagination';
import { paginate } from '@/utils/offset-pagination';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { assert } from 'console';
import { Repository } from 'typeorm';
import { CreateRoleReqDto } from './dto/create-role.req.dto';
import { ListRoleReqDto } from './dto/list-role.req.dto';
import { LoadMoreRoleReqDto } from './dto/load-more-roles.req.dto';
import { RoleResDto } from './dto/role.res.dto';
import { UpdateRoleReqDto } from './dto/update-role.req.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRespository: Repository<RoleEntity>,
  ) {}

  async create(dto: CreateRoleReqDto): Promise<RoleResDto> {
    const newRole = new RoleEntity({
      ...dto,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });

    const savedRole = await this.roleRespository.save(newRole);

    this.logger.debug(savedRole);

    return plainToInstance(RoleResDto, savedRole);
  }

  async findAll(
    reqDto: ListRoleReqDto,
  ): Promise<OffsetPaginatedDto<RoleResDto>> {
    const query = this.roleRespository
      .createQueryBuilder('role')
      .orderBy('role.createdAt', 'DESC');
    const [roles, metaDto] = await paginate<RoleEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(RoleResDto, roles), metaDto);
  }

  async loadMoreUsers(
    reqDto: LoadMoreRoleReqDto,
  ): Promise<CursorPaginatedDto<RoleResDto>> {
    const queryBuilder = this.roleRespository.createQueryBuilder('role');
    const paginator = buildPaginator({
      entity: RoleEntity,
      alias: 'role',
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

    return new CursorPaginatedDto(plainToInstance(RoleResDto, data), metaDto);
  }

  async findOne(id: Uuid): Promise<RoleResDto> {
    assert(id, 'id is required');
    const role = await this.roleRespository.findOneByOrFail({ id });
    return role.toDto(RoleResDto);
  }

  async update(id: Uuid, updateRoleDto: UpdateRoleReqDto) {
    const role = await this.roleRespository.findOneByOrFail({ id });

    role.name = updateRoleDto.name;
    role.description = updateRoleDto.description;
    role.permissions = updateRoleDto.permissions;
    role.updatedBy = SYSTEM_USER_ID;

    await this.roleRespository.save(role);
  }

  async remove(id: Uuid) {
    await this.roleRespository.findOneByOrFail({ id });
    await this.roleRespository.softDelete(id);
  }
}
