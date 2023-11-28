import {
  Controller,
  Post,
  Body,
  UnauthorizedException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  create(@Body() createUserDto: CreateUserDto): Omit<User, 'password'> {
    const createdUser = this.usersService.create(createUserDto);
    return createdUser;
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto): Promise<{ token: string } | null> {
    const { email, password } = loginDto;
    const result = await this.usersService.login(email, password);

    if (!result) {
      throw new UnauthorizedException('Email or password does not match');
    }

    return result;
}
}


