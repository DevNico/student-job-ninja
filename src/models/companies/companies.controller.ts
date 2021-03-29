import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  //apply auth to signup endpoint
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  signup(@Req() req, @Body() companyData: CreateCompanyDto): any {
    const result = this.companiesService.createCompany(companyData, req.user);
    return result;
  }
}
