import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({example: 'jeanpi3rm@gmail.com',
  description: 'The email of the user'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234',
  description: 'The password of the user',})
  @IsNotEmpty()
  password: string;
}