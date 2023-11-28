import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type:String,
    example:'email@gmail.com',
    required: true
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type:String,
    example:'123456789',
    required: true
  })
  password: string;
}