// TODO: better import syntax?
import { BaseAPIRequestFactory, RequiredError } from './baseapi';
import {Configuration} from '../configuration';
import { RequestContext, HttpMethod, ResponseContext, HttpFile} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {isCodeInRange} from '../util';

import { Student } from '../models/Student';

/**
 * no description
 */
export class GlobalApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * get student / company by id
     * @param uid 
     */
    public async appControllerGetUserById(uid: string, options?: Configuration): Promise<RequestContext> {
        let config = options || this.configuration;

        // verify required parameter 'uid' is not null or undefined
        if (uid === null || uid === undefined) {
            throw new RequiredError('Required parameter uid was null or undefined when calling appControllerGetUserById.');
        }


        // Path Params
        const localVarPath = '/user/{uid}'
            .replace('{' + 'uid' + '}', encodeURIComponent(String(uid)));

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

}

export class GlobalApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to appControllerGetUserById
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async appControllerGetUserById(response: ResponseContext): Promise<Student > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Student = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Student", ""
            ) as Student;
            return body;
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "user not found");
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            throw new ApiException<string>(response.httpStatusCode, "Internal MongoDB error.");
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Student = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Student", ""
            ) as Student;
            return body;
        }

        let body = response.body || "";
        throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }

}
