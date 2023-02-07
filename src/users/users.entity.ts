import { Reports } from "src/reports/reports.entity";
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";



@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Reports, (report) => report.user)
    reports: Reports[]

    @Column({default: true})
    admin:boolean
}