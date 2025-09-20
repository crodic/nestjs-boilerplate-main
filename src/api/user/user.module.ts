import { CaslAbilityFactory } from '@/utils/ability.factory';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([RoleEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, CaslAbilityFactory],
  exports: [UserService],
})
export class UserModule {}
