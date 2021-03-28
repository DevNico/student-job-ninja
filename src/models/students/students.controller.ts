import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private StudentsService: StudentsService) {}

  //For testing purposes only
  //apply auth to signup endpoint
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  signup(@Req() req): any {
    return req.user;
  }

  @Get('testcreate/:id')
  getProfile(@Param('id') id: string) {
    const result = this.StudentsService.createStudent({ studentId: id });
    return result;
  }
}
