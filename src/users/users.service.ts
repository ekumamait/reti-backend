import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: string): Promise<User> {
        return this.userRepository.findOne({ where: { id: parseInt(id, 10) } });
    }

    async create(createUserDto: CreateUserDto): Promise<User>{
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
      }






}
