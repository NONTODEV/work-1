import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import { jwtConfig } from '../../config';
import * as bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
    findByUsername(username: string): User | undefined {
        const usersData = this.readUsersJson();
        return usersData.find(user => user.email === username);
      }
    
      validateUser(username: string, password: string): User | null {
        const user = this.findByUsername(username);
    
        if (user && bcrypt.compareSync(password, user.password)) {
          return user;
        }
    
        return null;
      }

      create(createUserDto: CreateUserDto): Omit<User, 'password'> | null {
        const existingUser = this.findByUsername(createUserDto.email);
      
        if (existingUser) {
          throw new HttpException('Email is already', HttpStatus.BAD_REQUEST);
        }
      
        const hashedPassword = this.hashPassword(createUserDto.password);
        const user: User = {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        };
      
        const createdUser = this.saveUserToJson(user);
        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
      }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  private saveUserToJson(user: User): User {
    const usersData = this.readUsersJson();
    usersData.push(user);
    this.writeUsersJson(usersData);
    return user;
  }

  private readUsersJson(): User[] {
    try {
      const fileContents = fs.readFileSync('users.json', 'utf8');
      return JSON.parse(fileContents) as User[];
    } catch (error) {
      return [];
    }
  }

  private writeUsersJson(usersData: User[]): void {
    try {
      fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2), 'utf8');
    } catch (error) {
    }
  }

  async login(email: string, password: string): Promise<{ token: string } | null> {
    const user = this.findByUsername(email);
  
    if (user && (await this.comparePasswords(password, user.password))) {
      const token = this.generateJwtToken(user);
      return { token };
    }
  
    return null;
  }

  private generateJwtToken(user: User): string {
    const payload = { email: user.email, sub: user.email };
    const options = { expiresIn: '1h' };
  
    return jwt.sign(payload, jwtConfig.secretKey, options);
  }
  

  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}