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

import { ObservableAuthApi } from "./ObservableAPI";
import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";

export interface AuthApiAppControllerGetOwnProfileRequest {
}

export interface AuthApiCompaniesControllerSignupRequest {
    /**
     * 
     * @type CompanyDto
     * @memberof AuthApicompaniesControllerSignup
     */
    companyDto: CompanyDto
}

export interface AuthApiStudentsControllerSignupRequest {
    /**
     * 
     * @type StudentDto
     * @memberof AuthApistudentsControllerSignup
     */
    studentDto: StudentDto
}

export class ObjectAuthApi {
    private api: ObservableAuthApi

    public constructor(configuration: Configuration, requestFactory?: AuthApiRequestFactory, responseProcessor?: AuthApiResponseProcessor) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public appControllerGetOwnProfile(param: AuthApiAppControllerGetOwnProfileRequest, options?: Configuration): Promise<UserResponse> {
        return this.api.appControllerGetOwnProfile( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public companiesControllerSignup(param: AuthApiCompaniesControllerSignupRequest, options?: Configuration): Promise<Company> {
        return this.api.companiesControllerSignup(param.companyDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public studentsControllerSignup(param: AuthApiStudentsControllerSignupRequest, options?: Configuration): Promise<Student> {
        return this.api.studentsControllerSignup(param.studentDto,  options).toPromise();
    }

}

import { ObservableCompaniesApi } from "./ObservableAPI";
import { CompaniesApiRequestFactory, CompaniesApiResponseProcessor} from "../apis/CompaniesApi";

export interface CompaniesApiCompaniesControllerAddStudentsRequestToRequestsRequest {
    /**
     * 
     * @type string
     * @memberof CompaniesApicompaniesControllerAddStudentsRequestToRequests
     */
    studentId: string
    /**
     * 
     * @type string
     * @memberof CompaniesApicompaniesControllerAddStudentsRequestToRequests
     */
    jobId: string
}

export interface CompaniesApiCompaniesControllerCreateJobRequest {
    /**
     * 
     * @type CreateJobDto
     * @memberof CompaniesApicompaniesControllerCreateJob
     */
    createJobDto: CreateJobDto
}

export interface CompaniesApiCompaniesControllerDeleteRequest {
}

export interface CompaniesApiCompaniesControllerGetJobsByCompanyRequest {
}

export interface CompaniesApiCompaniesControllerUpdateProfileRequest {
    /**
     * 
     * @type CompanyDto
     * @memberof CompaniesApicompaniesControllerUpdateProfile
     */
    companyDto: CompanyDto
}

export class ObjectCompaniesApi {
    private api: ObservableCompaniesApi

    public constructor(configuration: Configuration, requestFactory?: CompaniesApiRequestFactory, responseProcessor?: CompaniesApiResponseProcessor) {
        this.api = new ObservableCompaniesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * add student to request
     * @param param the request object
     */
    public companiesControllerAddStudentsRequestToRequests(param: CompaniesApiCompaniesControllerAddStudentsRequestToRequestsRequest, options?: Configuration): Promise<boolean | Array<boolean>> {
        return this.api.companiesControllerAddStudentsRequestToRequests(param.studentId, param.jobId,  options).toPromise();
    }

    /**
     * create job
     * @param param the request object
     */
    public companiesControllerCreateJob(param: CompaniesApiCompaniesControllerCreateJobRequest, options?: Configuration): Promise<Job> {
        return this.api.companiesControllerCreateJob(param.createJobDto,  options).toPromise();
    }

    /**
     * delete own profile
     * @param param the request object
     */
    public companiesControllerDelete(param: CompaniesApiCompaniesControllerDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.companiesControllerDelete( options).toPromise();
    }

    /**
     * get published jobs
     * @param param the request object
     */
    public companiesControllerGetJobsByCompany(param: CompaniesApiCompaniesControllerGetJobsByCompanyRequest, options?: Configuration): Promise<Array<Job>> {
        return this.api.companiesControllerGetJobsByCompany( options).toPromise();
    }

    /**
     * update profile
     * @param param the request object
     */
    public companiesControllerUpdateProfile(param: CompaniesApiCompaniesControllerUpdateProfileRequest, options?: Configuration): Promise<Company> {
        return this.api.companiesControllerUpdateProfile(param.companyDto,  options).toPromise();
    }

}

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiAppControllerTestRequest {
}

export interface DefaultApiCompaniesControllerCreateTestJobRequest {
    /**
     * 
     * @type CreateJobDto
     * @memberof DefaultApicompaniesControllerCreateTestJob
     */
    createJobDto: CreateJobDto
}

export interface DefaultApiCompaniesControllerSendTestMailRequest {
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public appControllerTest(param: DefaultApiAppControllerTestRequest, options?: Configuration): Promise<any> {
        return this.api.appControllerTest( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public companiesControllerCreateTestJob(param: DefaultApiCompaniesControllerCreateTestJobRequest, options?: Configuration): Promise<Job> {
        return this.api.companiesControllerCreateTestJob(param.createJobDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public companiesControllerSendTestMail(param: DefaultApiCompaniesControllerSendTestMailRequest, options?: Configuration): Promise<void> {
        return this.api.companiesControllerSendTestMail( options).toPromise();
    }

}

import { ObservableGlobalApi } from "./ObservableAPI";
import { GlobalApiRequestFactory, GlobalApiResponseProcessor} from "../apis/GlobalApi";

export interface GlobalApiAppControllerGetUserByIdRequest {
    /**
     * 
     * @type string
     * @memberof GlobalApiappControllerGetUserById
     */
    uid: string
}

export class ObjectGlobalApi {
    private api: ObservableGlobalApi

    public constructor(configuration: Configuration, requestFactory?: GlobalApiRequestFactory, responseProcessor?: GlobalApiResponseProcessor) {
        this.api = new ObservableGlobalApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * get student / company by id
     * @param param the request object
     */
    public appControllerGetUserById(param: GlobalApiAppControllerGetUserByIdRequest, options?: Configuration): Promise<Student> {
        return this.api.appControllerGetUserById(param.uid,  options).toPromise();
    }

}

import { ObservableJobsApi } from "./ObservableAPI";
import { JobsApiRequestFactory, JobsApiResponseProcessor} from "../apis/JobsApi";

export interface JobsApiJobsControllerGetJobByIdRequest {
    /**
     * 
     * @type string
     * @memberof JobsApijobsControllerGetJobById
     */
    id: string
}

export interface JobsApiJobsControllerGetJobsByIdRequest {
    /**
     * 
     * @type Array&lt;string&gt;
     * @memberof JobsApijobsControllerGetJobsById
     */
    requestBody: Array<string>
}

export interface JobsApiJobsControllerSearchJobsRequest {
    /**
     * 
     * @type SearchJobDto
     * @memberof JobsApijobsControllerSearchJobs
     */
    searchJobDto: SearchJobDto
}

export class ObjectJobsApi {
    private api: ObservableJobsApi

    public constructor(configuration: Configuration, requestFactory?: JobsApiRequestFactory, responseProcessor?: JobsApiResponseProcessor) {
        this.api = new ObservableJobsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * get job by id
     * @param param the request object
     */
    public jobsControllerGetJobById(param: JobsApiJobsControllerGetJobByIdRequest, options?: Configuration): Promise<any> {
        return this.api.jobsControllerGetJobById(param.id,  options).toPromise();
    }

    /**
     * get jobs by ids
     * @param param the request object
     */
    public jobsControllerGetJobsById(param: JobsApiJobsControllerGetJobsByIdRequest, options?: Configuration): Promise<Array<any>> {
        return this.api.jobsControllerGetJobsById(param.requestBody,  options).toPromise();
    }

    /**
     * search for Jobs
     * @param param the request object
     */
    public jobsControllerSearchJobs(param: JobsApiJobsControllerSearchJobsRequest, options?: Configuration): Promise<Array<any>> {
        return this.api.jobsControllerSearchJobs(param.searchJobDto,  options).toPromise();
    }

}

import { ObservableStudentsApi } from "./ObservableAPI";
import { StudentsApiRequestFactory, StudentsApiResponseProcessor} from "../apis/StudentsApi";

export interface StudentsApiStudentsControllerAcceptJobRequest {
    /**
     * 
     * @type string
     * @memberof StudentsApistudentsControllerAcceptJob
     */
    jobId: string
}

export interface StudentsApiStudentsControllerDeleteRequest {
}

export interface StudentsApiStudentsControllerGetRequestsRequest {
}

export interface StudentsApiStudentsControllerRequestJobRequest {
    /**
     * 
     * @type string
     * @memberof StudentsApistudentsControllerRequestJob
     */
    jobId: string
}

export interface StudentsApiStudentsControllerUpdateProfileRequest {
    /**
     * 
     * @type UpdateStudentDto
     * @memberof StudentsApistudentsControllerUpdateProfile
     */
    updateStudentDto: UpdateStudentDto
}

export class ObjectStudentsApi {
    private api: ObservableStudentsApi

    public constructor(configuration: Configuration, requestFactory?: StudentsApiRequestFactory, responseProcessor?: StudentsApiResponseProcessor) {
        this.api = new ObservableStudentsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * accept job
     * @param param the request object
     */
    public studentsControllerAcceptJob(param: StudentsApiStudentsControllerAcceptJobRequest, options?: Configuration): Promise<void> {
        return this.api.studentsControllerAcceptJob(param.jobId,  options).toPromise();
    }

    /**
     * delete own profile
     * @param param the request object
     */
    public studentsControllerDelete(param: StudentsApiStudentsControllerDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.studentsControllerDelete( options).toPromise();
    }

    /**
     * get all requested jobs
     * @param param the request object
     */
    public studentsControllerGetRequests(param: StudentsApiStudentsControllerGetRequestsRequest, options?: Configuration): Promise<void> {
        return this.api.studentsControllerGetRequests( options).toPromise();
    }

    /**
     * request job
     * @param param the request object
     */
    public studentsControllerRequestJob(param: StudentsApiStudentsControllerRequestJobRequest, options?: Configuration): Promise<void> {
        return this.api.studentsControllerRequestJob(param.jobId,  options).toPromise();
    }

    /**
     * update profile
     * @param param the request object
     */
    public studentsControllerUpdateProfile(param: StudentsApiStudentsControllerUpdateProfileRequest, options?: Configuration): Promise<Student> {
        return this.api.studentsControllerUpdateProfile(param.updateStudentDto,  options).toPromise();
    }

}
