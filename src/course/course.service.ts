import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateCourseDto) {
    return await this.prisma.course.create({
      data: data,
    });
  }

  async enrollUser(courseId: string, userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: { course: true },
  });

  const alreadyEnrolled = user?.course.some(course => course.id === courseId);
  if (alreadyEnrolled) throw new BadRequestException('User already enrolled in this course');

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      course: {
        connect: { id: courseId },
      },
      
    },
    include:{
      course:true
    }
  });
}

  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minAmount,
      maxAmount,
      status,
    } = query;

    const filters: any = {};

    if (minAmount) filters.amount = { gte: Number(minAmount) };
    if (maxAmount) filters.amount = { ...filters.amount, lte: Number(maxAmount) };
    if (status) filters.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where: filters,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include:{
          user:true
          
        }
      }),
      this.prisma.course.count({ where: filters }
      ),
    ]);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data,
      

    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    },
    );
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async update(id: string, data: UpdateCourseDto) {
    try {
     await this.findOne(id)

      const updatedCourse = await this.prisma.course.update({
        where: { id },
        data: data
      });

      return updatedCourse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('O\'chirmoqchi bo\'lgan course topilmadi');
    }
    return await this.prisma.course.delete({ where: { id } });
  }
}
