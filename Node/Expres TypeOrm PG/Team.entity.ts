import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { IsDate, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Tenant } from './Tenant.entity';
import { User } from './User.entity';
import { Project } from './Project.entity';
import { Validate } from '../utils/validators';
import { sortBy } from 'lodash';

@Entity()
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @MaxLength(60)
  @Column({ length: 60 })
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  description: string;

  @Column({ default: false })
  isArchived: boolean;

  @IsDate()
  @IsOptional()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne((_) => Tenant, (tenant) => tenant.teams, { onDelete: 'CASCADE', nullable: false })
  tenant: Tenant;

  @ManyToMany((_) => User, (user) => user.teams)
  @ValidateNested()
  @JoinTable()
  users: User[];

  @ManyToMany((_) => Project, (project) => project.teams)
  @JoinTable()
  projects: Project[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await Validate(this, Team);
  }

  @AfterLoad()
  setWorkingStatus() {
    this.users = sortBy(this.users, ['firstName', 'lastName']);

    const tz = this.tenant?.timezone || 'Europe/Kiev';

    this.users.map(user => user.formatForTeamStatus(tz))
  }
}
