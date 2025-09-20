import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogSubscriber } from './subscribers/audit-log.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [AuditLogSubscriber],
})
export class AuditLogModule {}
