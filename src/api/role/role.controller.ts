import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { ApiAuth } from '@/decorators/http.decorators';
import { CheckPolicies } from '@/decorators/policies.decorator';
import { PoliciesGuard } from '@/guards/policies.guard';
import { AppAbility } from '@/libs/casl/ability.factory';
import { AppActions, AppSubjects } from '@/utils/permissions.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoleReqDto } from './dto/create-role.req.dto';
import { ListRoleReqDto } from './dto/list-role.req.dto';
import { RoleResDto } from './dto/role.res.dto';
import { UpdateRoleReqDto } from './dto/update-role.req.dto';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller({ path: 'roles', version: '1' })
@UseGuards(PoliciesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiAuth()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Create, AppSubjects.Role),
  )
  async create(@Body() reqDto: CreateRoleReqDto): Promise<RoleResDto> {
    return await this.roleService.create(reqDto);
  }

  @Get()
  @ApiAuth({
    type: RoleResDto,
    summary: 'List roles',
    isPaginated: true,
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.Role),
  )
  findAll(
    @Query() reqDto: ListRoleReqDto,
  ): Promise<OffsetPaginatedDto<RoleResDto>> {
    return this.roleService.findAll(reqDto);
  }

  @Get(':id')
  @ApiAuth({ type: RoleResDto, summary: 'Find role by id' })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.Role),
  )
  findOne(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({ type: RoleResDto, summary: 'Update role' })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Update, AppSubjects.Role),
  )
  update(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() updateRoleDto: UpdateRoleReqDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete role',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Delete, AppSubjects.Role),
  )
  @ApiParam({ name: 'id', type: 'String' })
  remove(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.roleService.remove(id);
  }
}
