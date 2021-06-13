import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import * as models from '../models/all';
import { Configuration} from '../configuration'

import { Address } from '../models/Address';
import { Company } from '../models/Company';
import { CompanyDto } from '../models/CompanyDto';
import { CreateJobDto } from '../models/CreateJobDto';
import { Job } from '../models/Job';
import { SearchJobDto } from '../models/SearchJobDto';
import { Student } from '../models/Student';
import { StudentDto } from '../models/StudentDto';
import { University } from '../models/University';
import { UpdateStudentDto } from '../models/UpdateStudentDto';
import { UserResponse } from '../models/UserResponse';
import { ObservableAuthApi } from './ObservableAPI';

import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";
export class PromiseAuthApi {
    private api: ObservableAuthApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthApiRequestFactory,
        responseProcessor?: AuthApiResponseProcessor
    ) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public appControllerGetOwnProfile(options?: Configuration): Promise<UserResponse> {
        const result = this.api.appControllerGetOwnProfile(options);
        return result.toPromise();
    }

    /**
     * @param companyDto 
     */
    public companiesControllerSignup(companyDto: CompanyDto, options?: Configuration): Promise<Company> {
        const result = this.api.companiesControllerSignup(companyDto, options);
        return result.toPromise();
    }

    /**
     * @param studentDto 
     */
    public studentsControllerSignup(studentDto: StudentDto, options?: Configuration): Promise<Student> {
        const result = this.api.studentsControllerSignup(studentDto, options);
        return result.toPromise();
    }


}



import { ObservableCompaniesApi } from './ObservableAPI';

import { CompaniesApiRequestFactory, CompaniesApiResponseProcessor} from "../apis/CompaniesApi";
export class PromiseCompaniesApi {
    private api: ObservableCompaniesApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CompaniesApiRequestFactory,
        responseProcessor?: CompaniesApiResponseProcessor
    ) {
        this.api = new ObservableCompaniesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * add student to request
     * @param studentId 
     * @param jobId 
     */
    public companiesControllerAddStudentsRequestToRequests(studentId: string, jobId: string, options?: Configuration): Promise<boolean | Array<boolean>> {
        const result = this.api.companiesControllerAddStudentsRequestToRequests(studentId, jobId, options);
        return result.toPromise();
    }

    /**
     * create job
     * @param createJobDto 
     */
    public companiesControllerCreateJob(createJobDto: CreateJobDto, options?: Configuration): Promise<Job> {
        const result = this.api.companiesControllerCreateJob(createJobDto, options);
        return result.toPromise();
    }

    /**
     * delete own profile
     */
    public companiesControllerDelete(options?: Configuration): Promise<void> {
        const result = this.api.companiesControllerDelete(options);
        return result.toPromise();
    }

    /**
     * get published jobs
     */
    public companiesControllerGetJobsByCompany(options?: Configuration): Promise<Array<Job>> {
        const result = this.api.companiesControllerGetJobsByCompany(options);
        return result.toPromise();
    }

    /**
     * update profile
     * @param companyDto 
     */
    public companiesControllerUpdateProfile(companyDto: CompanyDto, options?: Configuration): Promise<Company> {
        const result = this.api.companiesControllerUpdateProfile(companyDto, options);
        return result.toPromise();
    }


}



import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public appControllerTest(options?: Configuration): Promise<any> {
        const result = this.api.appControllerTest(options);
        return result.toPromise();
    }

    /**
     * @param createJobDto 
     */
    public companiesControllerCreateTestJob(createJobDto: CreateJobDto, options?: Configuration): Promise<Job> {
        const result = this.api.companiesControllerCreateTestJob(createJobDto, options);
        return result.toPromise();
    }

    /**
     */
    public companiesControllerSendTestMail(options?: Configuration): Promise<void> {
        const result = this.api.companiesControllerSendTestMail(options);
        return result.toPromise();
    }


}



import { ObservableGlobalApi } from './ObservableAPI';

import { GlobalApiRequestFactory, GlobalApiResponseProcessor} from "../apis/GlobalApi";
export class PromiseGlobalApi {
    private api: ObservableGlobalApi

    public constructor(
        configuration: Configuration,
        requestFactory?: GlobalApiRequestFactory,
        responseProcessor?: GlobalApiResponseProcessor
    ) {
        this.api = new ObservableGlobalApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * get student / company by id
     * @param uid 
     */
    public appControllerGetUserById(uid: string, options?: Configuration): Promise<Student> {
        const result = this.api.appControllerGetUserById(uid, options);
        return result.toPromise();
    }


}



import { ObservableJobsApi } from './ObservableAPI';

import { JobsApiRequestFactory, JobsApiResponseProcessor} from "../apis/JobsApi";
export class PromiseJobsApi {
    private api: ObservableJobsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: JobsApiRequestFactory,
        responseProcessor?: JobsApiResponseProcessor
    ) {
        this.api = new ObservableJobsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * get job by id
     * @param id 
     */
    public jobsControllerGetJobById(id: string, options?: Configuration): Promise<any> {
        const result = this.api.jobsControllerGetJobById(id, options);
        return result.toPromise();
    }

    /**
     * get jobs by ids
     * @param requestBody 
     */
    public jobsControllerGetJobsById(requestBody: Array<string>, options?: Configuration): Promise<Array<any>> {
        const result = this.api.jobsControllerGetJobsById(requestBody, options);
        return result.toPromise();
    }

    /**
     * search for Jobs
     * @param searchJobDto 
     */
    public jobsControllerSearchJobs(searchJobDto: SearchJobDto, options?: Configuration): Promise<Array<any>> {
        const result = this.api.jobsControllerSearchJobs(searchJobDto, options);
        return result.toPromise();
    }


}



import { ObservableStudentsApi } from './ObservableAPI';

import { StudentsApiRequestFactory, StudentsApiResponseProcessor} from "../apis/StudentsApi";
export class PromiseStudentsApi {
    private api: ObservableStudentsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: StudentsApiRequestFactory,
        responseProcessor?: StudentsApiResponseProcessor
    ) {
        this.api = new ObservableStudentsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * accept job
     * @param jobId 
     */
    public studentsControllerAcceptJob(jobId: string, options?: Configuration): Promise<void> {
        const result = this.api.studentsControllerAcceptJob(jobId, options);
        return result.toPromise();
    }

    /**
     * delete own profile
     */
    public studentsControllerDelete(options?: Configuration): Promise<void> {
        const result = this.api.studentsControllerDelete(options);
        return result.toPromise();
    }

    /**
     * get all requested jobs
     */
    public studentsControllerGetRequests(options?: Configuration): Promise<void> {
        const result = this.api.studentsControllerGetRequests(options);
        return result.toPromise();
    }

    /**
     * request job
     * @param jobId 
     */
    public studentsControllerRequestJob(jobId: string, options?: Configuration): Promise<void> {
        const result = this.api.studentsControllerRequestJob(jobId, options);
        return result.toPromise();
    }

    /**
     * update profile
     * @param updateStudentDto 
     */
    public studentsControllerUpdateProfile(updateStudentDto: UpdateStudentDto, options?: Configuration): Promise<Student> {
        const result = this.api.studentsControllerUpdateProfile(updateStudentDto, options);
        return result.toPromise();
    }


}



