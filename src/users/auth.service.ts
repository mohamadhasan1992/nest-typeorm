import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";


const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{
    constructor(private userService: UsersService){}


    async signup(email: string,password: string){
        const user = await this.userService.find(email);
        if(user.length){
            throw new BadRequestException('email is already taken!')
        }
        const salt = randomBytes(8).toString('hex'); // slat for concat to pass

        const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;

        const result = salt + '.' + hashedPassword.toString('hex');

        const newUser = await this.userService.create(email, result)
        return newUser;
    }
    async signin(email: string, password: string){
        const user = await this.userService.find(email);
        if(!user || user.length === 0){
            throw new NotFoundException('user not found')
        }
        const [salt, userDbPassword] = user[0].password.split('.');
        const hashIncomingPassword = (await scrypt(password, salt, 32)) as Buffer;

        if(userDbPassword !== hashIncomingPassword.toString('hex')){
            throw new BadRequestException('Bad email or password!')
        }else{
            return user[0];
        }

    }
}