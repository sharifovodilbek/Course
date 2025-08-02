import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { RoleD } from 'src/auth/decorator';
import { Role } from '@prisma/client';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @RoleD(Role.ADMIN)
  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() data: CreateCourseDto) {
    return this.courseService.create(data);
  }


  @RoleD(Role.USER)
  @Post(':id/enroll')
  @UseGuards(AuthGuard, RoleGuard)
  async enroll(@Param('id') courseId: string, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.courseService.enrollUser(courseId, userId);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @RoleD(Role.ADMIN)
  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() data: UpdateCourseDto) {
    return this.courseService.update(id, data);
  }

  @RoleD(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
