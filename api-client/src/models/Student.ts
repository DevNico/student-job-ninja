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
    Address,
    AddressFromJSON,
    AddressFromJSONTyped,
    AddressToJSON,
    University,
    UniversityFromJSON,
    UniversityFromJSONTyped,
    UniversityToJSON,
} from './';

/**
 * 
 * @export
 * @interface Student
 */
export interface Student {
    /**
     * id
     * @type {string}
     * @memberof Student
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    email: string;
    /**
     * 
     * @type {Array<object>}
     * @memberof Student
     */
    identities?: Array<object>;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    githubUrl: string;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    profileImageUrl: string;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    headerImageUrl: string;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof Student
     */
    yearsOfExperience: number;
    /**
     * 
     * @type {Address}
     * @memberof Student
     */
    address: Address;
    /**
     * 
     * @type {University}
     * @memberof Student
     */
    university: University;
    /**
     * 
     * @type {number}
     * @memberof Student
     */
    semester: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof Student
     */
    jobsMarkedIds?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Student
     */
    skills: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Student
     */
    languages: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof Student
     */
    fromAvailable: Date;
    /**
     * 
     * @type {Date}
     * @memberof Student
     */
    toAvailable: Date;
    /**
     * 
     * @type {string}
     * @memberof Student
     */
    workArea: string;
    /**
     * 
     * @type {number}
     * @memberof Student
     */
    workBasis: number;
}

export function StudentFromJSON(json: any): Student {
    return StudentFromJSONTyped(json, false);
}

export function StudentFromJSONTyped(json: any, ignoreDiscriminator: boolean): Student {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['_id'],
        'email': json['email'],
        'identities': !exists(json, 'identities') ? undefined : json['identities'],
        'githubUrl': json['githubUrl'],
        'profileImageUrl': json['profileImageUrl'],
        'headerImageUrl': json['headerImageUrl'],
        'firstName': json['firstName'],
        'lastName': json['lastName'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'yearsOfExperience': json['yearsOfExperience'],
        'address': AddressFromJSON(json['address']),
        'university': UniversityFromJSON(json['university']),
        'semester': json['semester'],
        'jobsMarkedIds': !exists(json, 'jobsMarkedIds') ? undefined : json['jobsMarkedIds'],
        'skills': json['skills'],
        'languages': json['languages'],
        'fromAvailable': (new Date(json['fromAvailable'])),
        'toAvailable': (new Date(json['toAvailable'])),
        'workArea': json['workArea'],
        'workBasis': json['workBasis'],
    };
}

export function StudentToJSON(value?: Student | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        '_id': value.id,
        'email': value.email,
        'identities': value.identities,
        'githubUrl': value.githubUrl,
        'profileImageUrl': value.profileImageUrl,
        'headerImageUrl': value.headerImageUrl,
        'firstName': value.firstName,
        'lastName': value.lastName,
        'description': value.description,
        'yearsOfExperience': value.yearsOfExperience,
        'address': AddressToJSON(value.address),
        'university': UniversityToJSON(value.university),
        'semester': value.semester,
        'jobsMarkedIds': value.jobsMarkedIds,
        'skills': value.skills,
        'languages': value.languages,
        'fromAvailable': (value.fromAvailable.toISOString()),
        'toAvailable': (value.toAvailable.toISOString()),
        'workArea': value.workArea,
        'workBasis': value.workBasis,
    };
}


