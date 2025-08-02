import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString } from "class-validator"
import { Role } from "@prisma/client"

export class CreateAuthDto {
    @ApiProperty({example:"John Doe"})
    @IsString()
    name:string
    @ApiProperty({example:"john@gmail.com"})
    @IsString()
    email:string
    @ApiProperty({example:"12345"})
    @IsString()
    password:string
    @ApiProperty({example:"ADMIN"})
    role:Role
}
