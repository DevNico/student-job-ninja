import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { CreateStudentDto } from './dtos/create-student.dto';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  //apply auth to signup endpoint
  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
    type: Student,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  signup(@Req() req, @Body() studentData: CreateStudentDto): any {
    const result = this.studentsService.createStudent(studentData, req.user);
    return result;
  }
}
