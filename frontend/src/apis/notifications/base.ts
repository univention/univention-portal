/* tslint:disable */
/* eslint-disable */
/**
 * Notifications API
 *    ## Overview  The Notifications API is part of the Univention Portal (Portal) and allows other services to integrate their user facing notifications with the Portal so that the user has a holistic view when using the Portal.   ### Intended usage scenario  - The delivery of notifications from other services to the API goes backend to   backend – the API then delivers the notifications to the Portal.  - The notification API service is always available for services to publish   notifications or to updated their published notifications.  - Notifications are pushed to the user if the user is online in the Portal.  - If the user is offline the API will cache the notifications and deliver them   as soon as the user is again online in the Portal.   ### API structure  The API endpoints can be grouped as follows:  - *Notification Sender API* -- This subset of endpoints is intended to be used   by services who want to send a notification for a given user.  - *Notification Receiver API* -- This subset shall fulfill the needs of the   Univention Portal, so that it can show the notifications to the user.  The groups may slightly overlap where appropriate.   ### API stability and backwards compatibility  A decision about the commitments regarding stability and backwards compatibility has not yet been made.  As a rule of thumb, the Sender part of the API is expected to have such a commitment once it stabilizes and reaches closer to the point of it\'s first release.  A scenario to have also other clients as *Receivers* besides the Portal has not been taken into account yet. Currently the Receiver section of the API is considered private to the Univention Portal and is not accompanied by any stability commitments.  
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from "./configuration";
// Some imports not used depending on template conditions
// @ts-ignore
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';

export const BASE_PATH = "http://localhost".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface RequestArgs
 */
export interface RequestArgs {
    url: string;
    options: AxiosRequestConfig;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: Configuration | undefined;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected axios: AxiosInstance = globalAxios) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name: "RequiredError" = "RequiredError";
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}