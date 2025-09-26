import { PostEntity } from '@/api/post/entities/post.entity';
import { RoleEntity } from '@/api/role/entities/role.entity';
import { Uuid } from '@/common/types/common.type';
import { EUserLoginProvider } from '@/constants/entity.enum';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { hashPassword as hashPass } from '@/utils/password.util';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { SessionEntity } from './session.entity';

@Entity('users')
@Index('UQ_user_provider', ['provider', 'providerId'], {
  where: '"provider_id" IS NOT NULL AND "deleted_at" IS NULL',
  unique: true,
})
export class UserEntity extends AbstractEntity {
  constructor(data?: Partial<UserEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: Uuid;

  @Column({
    length: 50,
    nullable: true,
  })
  @Index('UQ_user_username', {
    where: '"deleted_at" IS NULL',
    unique: true,
  })
  username: string;

  @Column()
  @Index('UQ_user_email', { where: '"deleted_at" IS NULL', unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: EUserLoginProvider.LOCAL })
  provider!: string;

  @Column({ name: 'provider_id', nullable: true })
  providerId?: string;

  @Column({ default: '' })
  bio?: string;

  @Column({ default: '' })
  image?: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions?: SessionEntity[];

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: Relation<PostEntity[]>;

  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_role',
  })
  role?: RoleEntity;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashPass(this.password);
    }
  }
}
