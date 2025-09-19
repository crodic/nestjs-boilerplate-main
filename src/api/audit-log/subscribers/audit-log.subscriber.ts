import { SessionEntity } from '@/api/user/entities/session.entity';
import { ClsService } from 'nestjs-cls';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';

@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  constructor(
    private dataSource: DataSource,
    private cls: ClsService<{ userId?: string }>,
  ) {
    this.dataSource.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<any>) {
    await this.saveLog('INSERT', event);
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await this.saveLog('UPDATE', event);
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.saveLog('DELETE', event);
  }

  private async saveLog(action: 'INSERT' | 'UPDATE' | 'DELETE', event: any) {
    if (
      event.metadata.name === AuditLogEntity.name ||
      event.metadata.name === SessionEntity.name
    )
      return;

    const auditRepo = event.manager.getRepository(AuditLogEntity);
    const userId = this.cls.get('userId');

    const log = auditRepo.create({
      entity: event.metadata.name,
      entityId: event.entity?.id ?? event.databaseEntity?.id,
      action,
      oldValue: event.databaseEntity ?? null,
      newValue: event.entity ?? null,
      userId,
    });

    await auditRepo.save(log);
  }
}
