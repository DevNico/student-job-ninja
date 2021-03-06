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
    CreateJobDto,
    CreateJobDtoFromJSON,
    CreateJobDtoToJSON,
    Job,
    JobFromJSON,
    JobToJSON,
} from '../models';

export interface CompaniesControllerCreateTestJobRequest {
    createJobDto: CreateJobDto;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     */
    async appControllerTestRaw(): Promise<runtime.ApiResponse<object>> {
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
            path: `/user/test/u`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     */
    async appControllerTest(): Promise<object> {
        const response = await this.appControllerTestRaw();
        return await response.value();
    }

    /**
     */
    async companiesControllerCreateTestJobRaw(requestParameters: CompaniesControllerCreateTestJobRequest): Promise<runtime.ApiResponse<Job>> {
        if (requestParameters.createJobDto === null || requestParameters.createJobDto === undefined) {
            throw new runtime.RequiredError('createJobDto','Required parameter requestParameters.createJobDto was null or undefined when calling companiesControllerCreateTestJob.');
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
            path: `/companies/jobtest`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateJobDtoToJSON(requestParameters.createJobDto),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => JobFromJSON(jsonValue));
    }

    /**
     */
    async companiesControllerCreateTestJob(requestParameters: CompaniesControllerCreateTestJobRequest): Promise<Job> {
        const response = await this.companiesControllerCreateTestJobRaw(requestParameters);
        return await response.value();
    }

}
