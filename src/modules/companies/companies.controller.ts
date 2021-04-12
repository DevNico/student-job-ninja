import { Company } from './entities/company.entity';
import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { CompaniesService } from './companies.service';
import { CompanyDto } from './dtos/company.dto';
import { SharedDataAccessService } from 'src/shared-data-access.service';

@Controller('companies')
export class CompaniesController {
  constructor(
    private companiesService: CompaniesService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}

  //apply auth to signup endpoint
  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    type: Company,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  signup(@Req() req, @Body() companyData: CompanyDto): any {
    const result = this.companiesService.createCompany(companyData, req.user);
    return result;
  }

  @ApiTags('companies')
  @ApiOperation({ summary: 'delete own profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The company has been deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard)
  @Delete()
  delete(@Req() req): any {
    const result = this.companiesService.delete(req.user);
    return result;
  }

  @ApiTags('companies')
  @ApiOperation({ summary: 'update profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The company has been updated.',
    type: Company,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard)
  @Put()
  updateProfile(@Req() req, @Body() updateData: CompanyDto): Promise<Company> {
    const result = this.sharedDataAccessService.updateProfile<
      Company,
      CompanyDto
    >(req.user.user_id, 'companies', updateData);
    return result;
  }
}
