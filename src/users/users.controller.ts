import { Body, Controller, Get, Post } from '@nestjs/common';
import { FormatResponse, FormattedResponse } from 'src/utils/formatResponse';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { RegisterDTO } from 'src/dtos/register.dto';
import { IUser } from 'src/types/user.interface';
import { LoginDTO } from 'src/dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  async create(
    @Body() data: RegisterDTO,
    res: Response,
  ): Promise<FormattedResponse<IUser>> {
    const isUsernameExists = await this.userService.findByUsername(
      data.username,
    );
    if (isUsernameExists) {
      return FormatResponse(null, 400, 'User already exists');
    }
    const userData = await this.userService.registerUser(data);
    return FormatResponse(userData, 200, 'User registered successfully');
  }

  @Post('login')
  async loginUser(@Body() loginData: LoginDTO, res: Response) {
    const { username, password } = loginData;
    const user = await this.userService.findByUsername(username);
    const payload = {
      id: user.id,
      role: user.role,
    };
    if (!user) {
      return FormatResponse(null, 400, "User doesn't exists");
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const token = await this.userService.generateToken(payload);
        const userData = { ...user, token };
        return FormatResponse(userData, 200, 'User logged in successfully!');
      } else {
        return FormatResponse(null, 400, 'Invalid credentials');
      }
    }
  }

  @Get()
  async hello() {
    console.log('Hello');
    return 'Hello world';
  }
}
