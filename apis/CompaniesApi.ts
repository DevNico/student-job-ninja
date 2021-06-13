// TODO: better import syntax?
import { BaseAPIRequestFactory, RequiredError } from './baseapi';
import {Configuration} from '../configuration';
import { RequestContext, HttpMethod, ResponseContext, HttpFile} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {isCodeInRange} from '../util';

import { Company } from '../models/Company';
import { CompanyDto } from '../models/CompanyDto';
import { CreateJobDto } from '../models/CreateJobDto';
import { Job } from '../models/Job';

/**
 * no description
 */
export class CompaniesApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * add student to request
     * @param studentId 
     * @param jobId 
     */
    public async companiesControllerAddStudentsRequestToRequests(studentId: string, jobId: string, options?: Configuration): Promise<RequestContext> {
        let config = options || this.configuration;

        // verify required parameter 'studentId' is not null or undefined
        if (studentId === null || studentId === undefined) {
            throw new RequiredError('Required parameter studentId was null or undefined when calling companiesControllerAddStudentsRequestToRequests.');
        }


        // verify required parameter 'jobId' is not null or undefined
        if (jobId === null || jobId === undefined) {
            throw new RequiredError('Required parameter jobId was null or undefined when calling companiesControllerAddStudentsRequestToRequests.');
        }


        // Path Params
        const localVarPath = '/companies/job/accept/{studentId}/{jobId}'
            .replace('{' + 'studentId' + '}', encodeURIComponent(String(studentId)))
            .replace('{' + 'jobId' + '}', encodeURIComponent(String(jobId)));

        // Make Request Context
        const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params

        // Header Params

        // Form Params


        // Body Params

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["access-token"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * create job
     * @param createJobDto 
     */
    public async companiesControllerCreateJob(createJobDto: CreateJobDto, options?: Configuration): Promise<RequestContext> {
        let config = options || this.configuration;

        // verify required parameter 'createJobDto' is not null or undefined
        if (createJobDto === null || createJobDto === undefined) {
            throw new RequiredError('Required parameter createJobDto was null or undefined when calling companiesControllerCreateJob.');
        }


        // Path Params
        const localVarPath = '/companies/job';

        // Make Request Context
        const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params

        // Header Params

        // Form Params


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createJobDto, "CreateJobDto", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["access-token"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * delete own profile
     */
    public async companiesControllerDelete(options?: Configuration): Promise<RequestContext> {
        let config = options || this.configuration;

        // Path Params
        const localVarPath = '/companies';

        // Make Request Context
        const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params

        // Header Params

        // Form Params


        // Body Params

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["access-token"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * get published jobs
     */
    public async companiesControllerGetJobsByCompany(options?: Configuration): Promise<RequestContext> {
        let config = options || this.configuration;

        // Path Params
        const localVarPath = '/companies/jobs';

        // Make Request Context
        const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params

        // Header Params

        // Form Params


        // Body Params

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["access-token"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * update profile
     * @param companyDto 
     */
    public async companiesControllerUpdateProfile(companyDto: CompanyDto, options?: Configuration): Promise<RequestContext> {
        let config = options || this.configuration;

        // verify required parameter 'companyDto' is not null or undefined
        if (companyDto === null || companyDto === undefined) {
            throw new RequiredError('Required parameter companyDto was null or undefined when calling companiesControllerUpdateProfile.');
        }


        // Path Params
        const localVarPath = '/companies';

        // Make Request Context
        const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params

        // Header Params

        // Form Params


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(companyDto, "CompanyDto", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["access-token"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class CompaniesApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to companiesControllerAddStudentsRequestToRequests
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async companiesControllerAddStudentsRequestToRequests(response: ResponseContext): Promise<boolean | Array<boolean> > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<boolean> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<boolean>", ""
            ) as Array<boolean>;
            return body;
        }
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: boolean = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "boolean", ""
            ) as boolean;
            return body;
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Forbidden.");
        }
        if (isCodeInRange("406", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Not Possible");
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Internal MongoDB error.");
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: boolean | Array<boolean> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "boolean | Array<boolean>", ""
            ) as boolean | Array<boolean>;
            return body;
        }

        let body = response.body || "";
        throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to companiesControllerCreateJob
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async companiesControllerCreateJob(response: ResponseContext): Promise<Job > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Job = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Job", ""
            ) as Job;
            return body;
        }
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: Job = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Job", ""
            ) as Job;
            return body;
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Forbidden.");
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Unprocurable entity");
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Internal MongoDB error.");
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Job = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Job", ""
            ) as Job;
            return body;
        }

        let body = response.body || "";
        throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to companiesControllerDelete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async companiesControllerDelete(response: ResponseContext): Promise<void > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return;
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Forbidden.");
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Internal MongoDB error.");
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return body;
        }

        let body = response.body || "";
        throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to companiesControllerGetJobsByCompany
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async companiesControllerGetJobsByCompany(response: ResponseContext): Promise<Array<Job> > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<Job> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Job>", ""
            ) as Array<Job>;
            return body;
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Forbidden.");
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "No Jobs found");
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Internal MongoDB error.");
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<Job> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Job>", ""
            ) as Array<Job>;
            return body;
        }

        let body = response.body || "";
        throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to companiesControllerUpdateProfile
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async companiesControllerUpdateProfile(response: ResponseContext): Promise<Company > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Company = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Company", ""
            ) as Company;
            return body;
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Forbidden.");
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Internal MongoDB error.");
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Company = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Company", ""
            ) as Company;
            return body;
        }

        let body = response.body || "";
        throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }

}
