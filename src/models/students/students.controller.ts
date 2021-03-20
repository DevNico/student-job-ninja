import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private StudentsService: StudentsService) {}

  @Get('testcreate/:id')
  getProfile(@Param('id') id: string) {
    const result = this.StudentsService.createStudent({ studentId: id });
    return result;
  }
}
