import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { CreateStudentDto } from './dtos/create-student.dto';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(
    private studentsService: StudentsService,
    private readonly sharedDataAccessService: SharedDataAccessService,
  ) {}

  //apply auth to signup endpoint
  @ApiTags('auth')
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
    type: Student,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiResponse({
    status: 406,
    description: 'Not Acceptable. Profile already exists.',
  })
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  signup(@Req() req, @Body() studentData: CreateStudentDto): any {
    const result = this.studentsService.createStudent(studentData, req.user);
    return result;
  }

  @ApiTags('students')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @UseGuards(FirebaseAuthGuard)
  @Put('update')
  updateProfile(
    @Req() req,
    @Body() studentData: CreateStudentDto,
  ): Promise<Student> {
    return null;
  }
}
