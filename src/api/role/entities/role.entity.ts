import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class RoleEntity extends AbstractEntity {
  constructor(data?: Partial<RoleEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_role_id',
  })
  id: string;

  @Index('UQ_roles_name', { unique: true, where: '"deleted_at" IS NULL' })
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: [] })
  permissions: string[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
