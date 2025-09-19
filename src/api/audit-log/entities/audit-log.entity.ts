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
  @Column({ nullable: true })
  entity_id: string;

  @Column({ type: 'varchar' })
  action: 'INSERT' | 'UPDATE' | 'DELETE';

  @Column('json', { nullable: true })
  old_value: any;

  @Column('json', { nullable: true })
  new_value: any;

  @Index()
  @Column({ nullable: true })
  user_id: string;

  @CreateDateColumn()
  created_at: Date;
}
