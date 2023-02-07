import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { GetEstimateDto } from './dtos/get-estimate-dto';
import { Reports } from './reports.entity';


@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Reports) private repo: Repository<Reports>){}

   
    createestimate({ make, model, lng, lat, year, mileage } : GetEstimateDto){
        // query builder
        return this.repo
                        .createQueryBuilder()
                        .select('AVG(price)', 'price')
                        // .select('*')
                        .where('make = :make',{make})
                        .andWhere('model = :model',{model})
                        .andWhere('lng - :lng BETWEEN -5 AND +5',{lng})
                        .andWhere('lat - :lat BETWEEN -5 AND +5',{lat})
                        .andWhere('year - :year BETWEEN -3 AND +3',{year})
                        .andWhere('approved IS TRUE')
                        .orderBy('ABS(mileage - :mileage)', 'DESC')
                        .setParameter('milage',{mileage})
                        .limit(3)
                        .getRawMany();

    }
    create(data: CreateReportDto, user: User){
        const report = this.repo.create(data);
        report.user = user;
        return this.repo.save(report)
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
