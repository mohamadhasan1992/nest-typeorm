import { Injectable, NotFoundException } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm"
import {User} from "./users.entity";


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string){
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }

    async findOne(id: number){
        const user = await this.repo.findOneBy({id});
        return user
    }

    find(email: string){
        return this.repo.find({where: {email}})
    }

    async update(id: number, attrs: Partial<User>){
        const user = await this.repo.findOneBy({id});
        if(!user){
            throw new NotFoundException('user not found!')
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.repo.findOneBy({id});
        if(!user){
            throw new NotFoundException('user not found!')
        }
        return this.repo.remove(user);

    }

}
