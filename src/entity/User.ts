import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";

import { Task } from "./Task";

@Entity()
export class User {

    constructor(name: string, email: string, password_hash: string){
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
    }

    @PrimaryGeneratedColumn()
    readonly id: number

    @Column()
    public name: string

    @Column({ unique: true })
    public email: string

    @Column()
    public password_hash: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    readonly created_at: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[]
}
