import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @ApiProperty({ example: "John Doe" })
    @IsString()
    name?: string
    @ApiProperty({ example: "john@gmail.com" })
    @IsString()
    email?: string
    @ApiProperty({ example: "12345" })
    @IsString()
    password?: string
    @ApiProperty({ example: "ADMIN" })
    role?: Role
}
