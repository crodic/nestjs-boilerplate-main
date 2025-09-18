import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity extends AbstractEntity {
  constructor(data?: Partial<RoleEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: [] })
  permissions: string[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
