// src/audit-log/audit-log.subscriber.ts
import { CurrentUserService } from '@/common/services/current-user.service';
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
    private currentUser: CurrentUserService,
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
    if (event.metadata.name === AuditLogEntity.name) return;

    const auditRepo = event.manager.getRepository(AuditLogEntity);
    const userId = this.currentUser.userId;

    const log = auditRepo.create({
      entity: event.metadata.name,
      entityId: event.entity?.id ?? event.databaseEntity?.id,
      action,
      old_value: event.databaseEntity ?? null,
      new_value: event.entity ?? null,
      user_id: userId,
    });

    await auditRepo.save(log);
  }
}
