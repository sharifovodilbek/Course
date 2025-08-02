import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateCourseDto {
    @ApiProperty({ example: "International" })
    @IsString()
    name: string
    @ApiProperty({ example: "It is the best selection for your future" })
    @IsString()
    description: string
    @ApiProperty({ example: "560000" })
    @IsNumber()
    price: number
    @ApiProperty({ example: "Tom Cruise" })
    @IsString()
    teacher: string
}
