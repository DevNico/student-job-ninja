import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UnprocessableEntityException,
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
import { Collections } from 'src/common/enums/colletions.enum';
import { Role } from 'src/common/enums/roles.enum';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { StudentDto } from './dtos/create-student.dto';
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
  signup(@Req() req, @Body() studentData: StudentDto): any {
    const registryCreated = this.sharedDataAccessService.addUserToAuthStore({
      _id: req.user.user_id,
      email: req.body.email,
      roles: [Role.Student],
    });
    if (!registryCreated) throw new UnprocessableEntityException();
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
  @UseGuards(FirebaseAuthGuard)
  @Put()
  updateProfile(@Req() req, @Body() updateData: StudentDto): Promise<Student> {
    const result = this.sharedDataAccessService.updateProfile<
      Student,
      StudentDto
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
  @UseGuards(FirebaseAuthGuard)
  @Delete()
  delete(@Req() req): any {
    const result = this.studentsService.delete(req.user);
    return result;
  }
}
