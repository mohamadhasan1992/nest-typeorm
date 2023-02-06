import { Body, Controller, Get, Param, Post, Query, Patch, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-dto-user';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto){
        return this.usersService.create(body.email, body.password);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:id')
    getOneUser(@Param('id') id: string){
        return this.usersService.findOne(parseInt(id))
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.usersService.find(email);
    }

    @Patch('/:id')
    updateOneUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body)
    }

    @Delete("/:id")
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }
}
