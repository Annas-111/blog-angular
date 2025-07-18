import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepo.findOne({ where: { email } });
    }

    async createUser(email: string, password: string, userName: string): Promise<User | null> {
        const user = this.usersRepo.create({ email, password, userName });
        return this.usersRepo.save(user);
    }
}
