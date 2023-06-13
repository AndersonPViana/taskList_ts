import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn  } from "typeorm";

import { User } from "./User";

@Entity()
export class Task {
  constructor(task: string, check: boolean) {
    this.task = task; 
    this.check = check;
  }

  @PrimaryGeneratedColumn()
  readonly id: number

  @Column()
  public task: string

  @Column()
  public check: boolean

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  readonly created_at: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date

  @ManyToOne(() => User, (user) => user.tasks)
  user: User
}