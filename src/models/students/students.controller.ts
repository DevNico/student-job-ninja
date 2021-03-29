import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  //For testing purposes only
  //apply auth to signup endpoint
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  signup(@Req() req, @Body() studentData: CreateStudentDto): any {
    const result = this.studentsService.createStudent(studentData, req.user);
    return result;
  }
}
