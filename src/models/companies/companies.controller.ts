import { Company } from './entities/company.entity';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

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
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  signup(@Req() req, @Body() companyData: CreateCompanyDto): any {
    const result = this.companiesService.createCompany(companyData, req.user);
    return result;
  }
}
