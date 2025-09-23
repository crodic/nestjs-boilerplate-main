import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogService } from './audit-log.service';
import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogSubscriber } from './subscribers/audit-log.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [AuditLogSubscriber, AuditLogService],
})
export class AuditLogModule {}
