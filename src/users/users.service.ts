import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from 'src/dtos/register.dto';
import { IUser } from 'src/types/user.interface';
import { sign } from 'jsonwebtoken';
import { Payload } from 'src/types/payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findByUsername(username: string): Promise<IUser> {
    const isUsername = await this.usersRepository.findOne({
      where: { username: username },
    });
    return isUsername;
  }

  async generateToken(payload: Payload): Promise<string> {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '8h' });
  }

  async registerUser(data: RegisterDTO): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const userData = this.usersRepository.save(data);
    return userData;
  }
}
