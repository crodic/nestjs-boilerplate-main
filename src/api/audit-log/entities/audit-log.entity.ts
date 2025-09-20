import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  entity: string;

  @Index()
  @Column({ nullable: true, name: 'entity_id' })
  entityId: string;

  @Column({ type: 'varchar' })
  action: 'INSERT' | 'UPDATE' | 'DELETE';

  @Column('json', { nullable: true, name: 'old_value' })
  oldValue: any;

  @Column('json', { nullable: true, name: 'new_value' })
  newValue: any;

  @Index()
  @Column({ nullable: true, name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
