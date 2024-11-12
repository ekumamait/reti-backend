import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    // GET /users ---> [users]
    @Get()
    getUsers(): Promise<User[]>{
        return this.usersService.findAll();
    }


    // GET /users/:id ---> {user} 
    @Get(':id')
    getUser(@Param('id') id: string): Promise<User>{
        return this.usersService.findOne(id);
    }

    // POST /users ---> {user}
    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<User>{
        return this.usersService.create(createUserDto); 
    }

    // PUT /users/:id ---> {user}
    @Put(':id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: CreateUserDto): Promise<User>{
        return this.usersService.create(updateUserDto)
    }

    // DELETE /users/:id ---> {user}
    @Delete(':id')
    deleteUser(@Param('id') id: string): Promise<void>{
        return this.usersService.remove(id);
    }



}
