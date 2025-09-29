import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_audit_log_id',
  })
  id: string;

  @Index('IDX_audit_logs_entity')
  @Column()
  entity: string;

  @Index('IDX_audit_logs_entity_id')
  @Column({ nullable: true, name: 'entity_id' })
  entityId: string;

  @Column({ type: 'varchar' })
  action: 'INSERT' | 'UPDATE' | 'DELETE';

  @Column('json', { nullable: true, name: 'old_value' })
  oldValue: any;

  @Column('json', { nullable: true, name: 'new_value' })
  newValue: any;

  @Index('IDX_audit_logs_user_id')
  @Column({ nullable: true, name: 'user_id' })
  userId: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;
}
