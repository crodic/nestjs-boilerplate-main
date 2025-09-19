import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { CheckPolicies } from '@/decorators/policies.decorator';
import { PoliciesGuard } from '@/guards/policies.guard';
import { AppAbility } from '@/utils/ability.factory';
import { AppActions, AppSubjects } from '@/utils/permissions.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoleReqDto } from './dto/create-role.req.dto';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { LoadMoreUsersReqDto } from './dto/load-more-users.req.dto';
import { RoleResDto } from './dto/role.res.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(PoliciesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiAuth({
    type: UserResDto,
    summary: 'Get current user',
  })
  @Get('me')
  async getCurrentUser(@CurrentUser('id') userId: Uuid): Promise<UserResDto> {
    return await this.userService.findOne(userId);
  }

  @Post()
  @ApiAuth({
    type: UserResDto,
    summary: 'Create user',
    statusCode: HttpStatus.CREATED,
  })
  async createUser(
    @Body() createUserDto: CreateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiAuth({
    type: UserResDto,
    summary: 'List users',
    isPaginated: true,
  })
  @CheckPolicies((abilyti: AppAbility) =>
    abilyti.can(AppActions.Read, AppSubjects.User),
  )
  async findAllUsers(
    @Query() reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<UserResDto>> {
    return await this.userService.findAll(reqDto);
  }

  @Get('/load-more')
  @ApiAuth({
    type: UserResDto,
    summary: 'Load more users',
    isPaginated: true,
    paginationType: 'cursor',
  })
  async loadMoreUsers(
    @Query() reqDto: LoadMoreUsersReqDto,
  ): Promise<CursorPaginatedDto<UserResDto>> {
    return await this.userService.loadMoreUsers(reqDto);
  }

  @Get(':id')
  @ApiAuth({ type: UserResDto, summary: 'Find user by id' })
  @ApiParam({ name: 'id', type: 'String' })
  async findUser(@Param('id', ParseUUIDPipe) id: Uuid): Promise<UserResDto> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({ type: UserResDto, summary: 'Update user' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Update, AppSubjects.User),
  )
  @ApiParam({ name: 'id', type: 'String' })
  updateUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateUserReqDto,
  ) {
    return this.userService.update(id, reqDto);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete user',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @ApiParam({ name: 'id', type: 'String' })
  removeUser(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.userService.remove(id);
  }

  @ApiAuth()
  @Post('me/change-password')
  async changePassword() {
    return 'change-password';
  }

  @Post('roles')
  @ApiAuth()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Create, AppSubjects.Role),
  )
  async createNewRole(@Body() reqDto: CreateRoleReqDto): Promise<RoleResDto> {
    return await this.userService.createRole(reqDto);
  }
}
