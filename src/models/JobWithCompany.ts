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

import { exists, mapValues } from '../runtime';
import {
    Company,
    CompanyFromJSON,
    CompanyFromJSONTyped,
    CompanyToJSON,
} from './';

/**
 * 
 * @export
 * @interface JobWithCompany
 */
export interface JobWithCompany {
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    publisherId: string;
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    contactMail: string;
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    jobName: string;
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    jobDescription: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof JobWithCompany
     */
    jobQualifications: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof JobWithCompany
     */
    skills: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    workArea: string;
    /**
     * 
     * @type {number}
     * @memberof JobWithCompany
     */
    workBasis: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof JobWithCompany
     */
    languages: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof JobWithCompany
     */
    from: Date;
    /**
     * 
     * @type {Date}
     * @memberof JobWithCompany
     */
    to: Date;
    /**
     * 
     * @type {Array<string>}
     * @memberof JobWithCompany
     */
    requestedByStudents: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof JobWithCompany
     */
    requestedIds: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    finalAcceptedId: string;
    /**
     * 
     * @type {Company}
     * @memberof JobWithCompany
     */
    publisher: Company;
    /**
     * 
     * @type {boolean}
     * @memberof JobWithCompany
     */
    active: boolean;
    /**
     * 
     * @type {string}
     * @memberof JobWithCompany
     */
    headerImageUrl: string;
}

export function JobWithCompanyFromJSON(json: any): JobWithCompany {
    return JobWithCompanyFromJSONTyped(json, false);
}

export function JobWithCompanyFromJSONTyped(json: any, ignoreDiscriminator: boolean): JobWithCompany {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['_id'],
        'publisherId': json['publisher_id'],
        'contactMail': json['contactMail'],
        'jobName': json['jobName'],
        'jobDescription': json['jobDescription'],
        'jobQualifications': json['jobQualifications'],
        'skills': json['skills'],
        'workArea': json['workArea'],
        'workBasis': json['workBasis'],
        'languages': json['languages'],
        'from': (new Date(json['from'])),
        'to': (new Date(json['to'])),
        'requestedByStudents': json['requested_by_students'],
        'requestedIds': json['requested_ids'],
        'finalAcceptedId': json['final_accepted_id'],
        'publisher': CompanyFromJSON(json['publisher']),
        'active': json['active'],
        'headerImageUrl': json['headerImageUrl'],
    };
}

export function JobWithCompanyToJSON(value?: JobWithCompany | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        '_id': value.id,
        'publisher_id': value.publisherId,
        'contactMail': value.contactMail,
        'jobName': value.jobName,
        'jobDescription': value.jobDescription,
        'jobQualifications': value.jobQualifications,
        'skills': value.skills,
        'workArea': value.workArea,
        'workBasis': value.workBasis,
        'languages': value.languages,
        'from': (value.from.toISOString()),
        'to': (value.to.toISOString()),
        'requested_by_students': value.requestedByStudents,
        'requested_ids': value.requestedIds,
        'final_accepted_id': value.finalAcceptedId,
        'publisher': CompanyToJSON(value.publisher),
        'active': value.active,
        'headerImageUrl': value.headerImageUrl,
    };
}


