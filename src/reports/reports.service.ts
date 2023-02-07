import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Reports } from './reports.entity';


@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Reports) private repo: Repository<Reports>){}

    findOne(id: number){

    }
    find(){

    }
    create(data: CreateReportDto, user: User){
        const report = this.repo.create(data);
        report.user = user;
        return this.repo.save(report)
    }
    update(){

    }
    remove(){

    }
    async changeApproval(id: number, approved: boolean){
        const report = await this.repo.findOneBy({id})
        if(!report){
            throw new NotFoundException('report not found!')
        }
        report.approved = approved;
        return this.repo.save(report)
    }
}
