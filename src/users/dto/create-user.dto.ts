import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        type:String,
        example:'email@gmail.com',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type:String,
        example:'123456789',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        type:String,
        example:'Notfound',
        required: false
    })
    @IsOptional()
    name?: string | null;
  }