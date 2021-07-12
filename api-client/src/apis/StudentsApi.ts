/* tslint:disable */
/* eslint-disable */
/**
 * JS-SS21 API Documentation
 * API description
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    JobWithCompany,
    JobWithCompanyFromJSON,
    JobWithCompanyToJSON,
    Student,
    StudentFromJSON,
    StudentToJSON,
    ToggleSavedJobsResponse,
    ToggleSavedJobsResponseFromJSON,
    ToggleSavedJobsResponseToJSON,
    UpdateStudentDto,
    UpdateStudentDtoFromJSON,
    UpdateStudentDtoToJSON,
} from '../models';

export interface StudentsControllerAcceptJobRequest {
    jobId: string;
}

export interface StudentsControllerRequestJobRequest {
    jobId: string;
}

export interface StudentsControllerToggleSavedJobsRequest {
    jobId: string;
}

export interface StudentsControllerUpdateProfileRequest {
    updateStudentDto: UpdateStudentDto;
}

/**
 * 
 */
export class StudentsApi extends runtime.BaseAPI {

    /**
     * accept job
     */
    async studentsControllerAcceptJobRaw(requestParameters: StudentsControllerAcceptJobRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.jobId === null || requestParameters.jobId === undefined) {
            throw new runtime.RequiredError('jobId','Required parameter requestParameters.jobId was null or undefined when calling studentsControllerAcceptJob.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("access-token", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/students/accept/{jobId}`.replace(`{${"jobId"}}`, encodeURIComponent(String(requestParameters.jobId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * accept job
     */
    async studentsControllerAcceptJob(requestParameters: StudentsControllerAcceptJobRequest): Promise<void> {
        await this.studentsControllerAcceptJobRaw(requestParameters);
    }

    /**
     * delete own profile
     */
    async studentsControllerDeleteRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("access-token", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/students`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * delete own profile
     */
    async studentsControllerDelete(): Promise<void> {
        await this.studentsControllerDeleteRaw();
    }

    /**
     * get all requested jobs
     */
    async studentsControllerGetRequestsRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("access-token", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/students/requests`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * get all requested jobs
     */
    async studentsControllerGetRequests(): Promise<void> {
        await this.studentsControllerGetRequestsRaw();
    }

    /**
     * get own saved (Bookmarked) jobs
     */
    async studentsControllerGetSavedJobsRaw(): Promise<runtime.ApiResponse<Array<JobWithCompany>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("access-token", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/students/saved`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(JobWithCompanyFromJSON));
    }

    /**
     * get own saved (Bookmarked) jobs
     */
    async studentsControllerGetSavedJobs(): Promise<Array<JobWithCompany>> {
        const response = await this.studentsControllerGetSavedJobsRaw();
        return await response.value();
    }

    /**
     * request job
     */
    async studentsControllerRequestJobRaw(requestParameters: StudentsControllerRequestJobRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.jobId === null || requestParameters.jobId === undefined) {
            throw new runtime.RequiredError('jobId','Required parameter requestParameters.jobId was null or undefined when calling studentsControllerRequestJob.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("access-token", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/students/request/{jobId}`.replace(`{${"jobId"}}`, encodeURIComponent(String(requestParameters.jobId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * request job
     */
    async studentsControllerRequestJob(requestParameters: StudentsControllerRequestJobRequest): Promise<void> {
        await this.studentsControllerRequestJobRaw(requestParameters);
    }

    /**
     * toggle saved (Bookmarked) jobs (add/delete)
     */
    async studentsControllerToggleSavedJobsRaw(requestParameters: StudentsControllerToggleSavedJobsRequest): Promise<runtime.ApiResponse<ToggleSavedJobsResponse>> {
        if (requestParameters.jobId === null || requestParameters.jobId === undefined) {
            throw new runtime.RequiredError('jobId','Required parameter requestParameters.jobId was null or undefined when calling studentsControllerToggleSavedJobs.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("access-token", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/students/saved/{jobId}`.replace(`{${"jobId"}}`, encodeURIComponent(String(requestParameters.jobId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ToggleSavedJobsResponseFromJSON(jsonValue));
    }

    /**
     * toggle saved (Bookmarked) jobs (add/delete)
     */
    async studentsControllerToggleSavedJobs(requestParameters: StudentsControllerToggleSavedJobsRequest): Promise<ToggleSavedJobsResponse> {
        const response = await this.studentsControllerToggleSavedJobsRaw(requestParameters);
        return await response.value();
    }

    /**
     * update profile
     */
    async studentsControllerUpdateProfileRaw(requestParameters: StudentsControllerUpdateProfileRequest): Promise<runtime.ApiResponse<Student>> {
        if (requestParameters.updateStudentDto === null || requestParameters.updateStudentDto === undefined) {
            throw new runtime.RequiredError('updateStudentDto','Required parameter requestParameters.updateStudentDto was null or undefined when calling studentsControllerUpdateProfile.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("access-token", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/students`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateStudentDtoToJSON(requestParameters.updateStudentDto),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => StudentFromJSON(jsonValue));
    }

    /**
     * update profile
     */
    async studentsControllerUpdateProfile(requestParameters: StudentsControllerUpdateProfileRequest): Promise<Student> {
        const response = await this.studentsControllerUpdateProfileRaw(requestParameters);
        return await response.value();
    }

}