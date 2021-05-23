import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Collections } from 'src/common/enums/colletions.enum';
import { Role } from 'src/common/enums/roles.enum';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { StudentDto } from './dtos/create-student.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { Student } from './entities/student.entity';
import { StudentsService } from './services/students.service';

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
  async signup(
    @Req() req: Express.Request,
    @Body() studentData: StudentDto,
  ): Promise<any> {
    await this.sharedDataAccessService.addUserToAuthStore({
      _id: req.user.user_id,
      email: studentData.email,
      roles: [Role.Student],
    });
    const result = this.studentsService.createStudent(studentData, req.user);
    return result;
  }

  @ApiTags('students')
  @ApiOperation({ summary: 'update profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Students profile has been updated.',
    type: Student,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Put()
  async updateProfile(
    @Req() req: Express.Request,
    @Body() updateData: UpdateStudentDto,
  ): Promise<Student> {
    const result = this.sharedDataAccessService.updateProfile<
      Student,
      UpdateStudentDto
    >(req.user.user_id, Collections.Students, updateData);
    return result;
  }

  @ApiTags('students')
  @ApiOperation({ summary: 'delete own profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The student has been deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Delete()
  delete(@Req() req: Express.Request): Promise<void> {
    return this.studentsService.delete(req.user);
  }
}
