import { Body, Controller, Get, Param, Post, Query, Patch, Delete, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-dto-user';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorators';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService){}

    @Get('/me')
    @UseGuards(AuthGuard)
    getMe(@CurrentUser() user: User){
        return user;
    }

    @Post('/signup')
    async signup(@Body() body: CreateUserDto, @Session() session: any){
        const user =  await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user =  await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signout(@Session() session: any){
        session.userId = null;
    }

    @Get('/:id')
    getOneUser(@Param('id') id: string){
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.usersService.find(email);
    }

    @Patch('/:id')
    updateOneUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body);
    }

    @Delete("/:id")
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }
}
