/**
 * SPDX-FileCopyrightText: 2023-2024 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 *
 * @export
 * @interface HTTPValidationError
 */
export interface HTTPValidationError {
    /**
     *
     * @type {Array<ValidationError>}
     * @memberof HTTPValidationError
     */
    'detail'?: Array<ValidationError>;
}
/**
 * Allows to augment the notification with a link. The intended usage is to provide a link which the user can follow to reach the resource which the notification is about.
 * @export
 * @interface Link
 */
export interface Link {
    /**
     * The accepted URLs are limited to HTTP and HTTPS, they must be absolute URLs.
     * @type {string}
     * @memberof Link
     */
    'url': string;
    /**
     *
     * @type {string}
     * @memberof Link
     */
    'text'?: string;
    /**
     *
     * @type {string}
     * @memberof Link
     */
    'target'?: string;
}
/**
 *
 * @export
 * @interface LocationInner
 */
export interface LocationInner {
}
/**
 *
 * @export
 * @interface NotificationCreate
 */
export interface NotificationCreate {
    /**
     *
     * @type {string}
     * @memberof NotificationCreate
     */
    'sourceUid': string;
    /**
     *
     * @type {string}
     * @memberof NotificationCreate
     */
    'targetUid': string;
    /**
     * The notification title shall be visible to the user in a highlighted way. The title should be kept short.
     * @type {string}
     * @memberof NotificationCreate
     */
    'title': string;
    /**
     * The notification details shall be visible to the user below the title. The details can be longer than the title.
     * @type {string}
     * @memberof NotificationCreate
     */
    'details': string;
    /**
     * The severity influences how the notification will be displayed to the user. Typically this influences the background color. It does not influence if the notification is shown or not.
     * @type {NotificationSeverity}
     * @memberof NotificationCreate
     */
    'severity': NotificationSeverity;
    /**
     * A point in time at which the notification is not relevant anymore. After this point in time the notification shall not be presented to the user anymore.
     * @type {string}
     * @memberof NotificationCreate
     */
    'expireTime'?: string;
    /**
     *
     * @type {Link}
     * @memberof NotificationCreate
     */
    'link'?: Link;
}
/**
 *
 * @export
 * @interface NotificationLink
 */
export interface NotificationLink {
    /**
     * The accepted URLs are limited to HTTP and HTTPS, they must be absolute URLs.
     * @type {string}
     * @memberof NotificationLink
     */
    'url': string;
    /**
     *
     * @type {string}
     * @memberof NotificationLink
     */
    'text'?: string;
    /**
     *
     * @type {string}
     * @memberof NotificationLink
     */
    'target'?: string;
}
/**
 *
 * @export
 * @interface NotificationRead
 */
export interface NotificationRead {
    /**
     *
     * @type {string}
     * @memberof NotificationRead
     */
    'sourceUid': string;
    /**
     *
     * @type {string}
     * @memberof NotificationRead
     */
    'targetUid': string;
    /**
     * The notification title shall be visible to the user in a highlighted way. The title should be kept short.
     * @type {string}
     * @memberof NotificationRead
     */
    'title': string;
    /**
     * The notification details shall be visible to the user below the title. The details can be longer than the title.
     * @type {string}
     * @memberof NotificationRead
     */
    'details': string;
    /**
     * The severity influences how the notification will be displayed to the user. Typically this influences the background color. It does not influence if the notification is shown or not.
     * @type {NotificationSeverity}
     * @memberof NotificationRead
     */
    'severity': NotificationSeverity;
    /**
     * A point in time at which the notification is not relevant anymore. After this point in time the notification shall not be presented to the user anymore.
     * @type {string}
     * @memberof NotificationRead
     */
    'expireTime'?: string;
    /**
     *
     * @type {Link}
     * @memberof NotificationRead
     */
    'link'?: Link;
    /**
     *
     * @type {string}
     * @memberof NotificationRead
     */
    'id': string;
    /**
     *
     * @type {boolean}
     * @memberof NotificationRead
     */
    'popup'?: boolean;
}
/**
 * An enumeration.
 * @export
 * @enum {string}
 */

export const NotificationSeverity = {
    Info: 'info',
    Success: 'success',
    Warning: 'warning',
    Error: 'error'
} as const;

export type NotificationSeverity = typeof NotificationSeverity[keyof typeof NotificationSeverity];


/**
 *
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     *
     * @type {Array<LocationInner>}
     * @memberof ValidationError
     */
    'loc': Array<LocationInner>;
    /**
     *
     * @type {string}
     * @memberof ValidationError
     */
    'msg': string;
    /**
     *
     * @type {string}
     * @memberof ValidationError
     */
    'type': string;
}

/**
 * ReceiverApi - axios parameter creator
 * @export
 */
export const ReceiverApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
         * @summary Delete Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteNotificationV1NotificationsIdDelete: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteNotificationV1NotificationsIdDelete', 'id', id)
            const localVarPath = `/v1/notifications/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;



            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         *
         * @summary Get Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationV1NotificationsIdGet: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getNotificationV1NotificationsIdGet', 'id', id)
            const localVarPath = `/v1/notifications/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;



            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Read the notifications of the current user.
         * @summary Get Notifications
         * @param {string} [limit]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationsV1NotificationsGet: async (limit?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/notifications/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }



            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Flag a notification as hidden.  This will set the attribute `popup` to `false`.
         * @summary Hide Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        hideNotificationV1NotificationsIdHidePost: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('hideNotificationV1NotificationsIdHidePost', 'id', id)
            const localVarPath = `/v1/notifications/{id}/hide`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;



            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         *
         * @summary Stream Notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        streamNotificationsV1NotificationsStreamGet: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/notifications/stream`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;



            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ReceiverApi - functional programming interface
 * @export
 */
export const ReceiverApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ReceiverApiAxiosParamCreator(configuration)
    return {
        /**
         * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
         * @summary Delete Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteNotificationV1NotificationsIdDelete(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteNotificationV1NotificationsIdDelete(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         *
         * @summary Get Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getNotificationV1NotificationsIdGet(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<NotificationRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getNotificationV1NotificationsIdGet(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Read the notifications of the current user.
         * @summary Get Notifications
         * @param {string} [limit]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getNotificationsV1NotificationsGet(limit?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NotificationRead>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getNotificationsV1NotificationsGet(limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Flag a notification as hidden.  This will set the attribute `popup` to `false`.
         * @summary Hide Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async hideNotificationV1NotificationsIdHidePost(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.hideNotificationV1NotificationsIdHidePost(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         *
         * @summary Stream Notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async streamNotificationsV1NotificationsStreamGet(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.streamNotificationsV1NotificationsStreamGet(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ReceiverApi - factory interface
 * @export
 */
export const ReceiverApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ReceiverApiFp(configuration)
    return {
        /**
         * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
         * @summary Delete Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteNotificationV1NotificationsIdDelete(id: string, options?: any): AxiosPromise<any> {
            return localVarFp.deleteNotificationV1NotificationsIdDelete(id, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Get Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationV1NotificationsIdGet(id: string, options?: any): AxiosPromise<NotificationRead> {
            return localVarFp.getNotificationV1NotificationsIdGet(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Read the notifications of the current user.
         * @summary Get Notifications
         * @param {string} [limit]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationsV1NotificationsGet(limit?: string, options?: any): AxiosPromise<Array<NotificationRead>> {
            return localVarFp.getNotificationsV1NotificationsGet(limit, options).then((request) => request(axios, basePath));
        },
        /**
         * Flag a notification as hidden.  This will set the attribute `popup` to `false`.
         * @summary Hide Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        hideNotificationV1NotificationsIdHidePost(id: string, options?: any): AxiosPromise<any> {
            return localVarFp.hideNotificationV1NotificationsIdHidePost(id, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Stream Notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        streamNotificationsV1NotificationsStreamGet(options?: any): AxiosPromise<any> {
            return localVarFp.streamNotificationsV1NotificationsStreamGet(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ReceiverApi - interface
 * @export
 * @interface ReceiverApi
 */
export interface ReceiverApiInterface {
    /**
     * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
     * @summary Delete Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApiInterface
     */
    deleteNotificationV1NotificationsIdDelete(id: string, options?: AxiosRequestConfig): AxiosPromise<any>;

    /**
     *
     * @summary Get Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApiInterface
     */
    getNotificationV1NotificationsIdGet(id: string, options?: AxiosRequestConfig): AxiosPromise<NotificationRead>;

    /**
     * Read the notifications of the current user.
     * @summary Get Notifications
     * @param {string} [limit]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApiInterface
     */
    getNotificationsV1NotificationsGet(limit?: string, options?: AxiosRequestConfig): AxiosPromise<Array<NotificationRead>>;

    /**
     * Flag a notification as hidden.  This will set the attribute `popup` to `false`.
     * @summary Hide Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApiInterface
     */
    hideNotificationV1NotificationsIdHidePost(id: string, options?: AxiosRequestConfig): AxiosPromise<any>;

    /**
     *
     * @summary Stream Notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApiInterface
     */
    streamNotificationsV1NotificationsStreamGet(options?: AxiosRequestConfig): AxiosPromise<any>;

}

/**
 * ReceiverApi - object-oriented interface
 * @export
 * @class ReceiverApi
 * @extends {BaseAPI}
 */
export class ReceiverApi extends BaseAPI implements ReceiverApiInterface {
    /**
     * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
     * @summary Delete Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApi
     */
    public deleteNotificationV1NotificationsIdDelete(id: string, options?: AxiosRequestConfig) {
        return ReceiverApiFp(this.configuration).deleteNotificationV1NotificationsIdDelete(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @summary Get Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApi
     */
    public getNotificationV1NotificationsIdGet(id: string, options?: AxiosRequestConfig) {
        return ReceiverApiFp(this.configuration).getNotificationV1NotificationsIdGet(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Read the notifications of the current user.
     * @summary Get Notifications
     * @param {string} [limit]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApi
     */
    public getNotificationsV1NotificationsGet(limit?: string, options?: AxiosRequestConfig) {
        return ReceiverApiFp(this.configuration).getNotificationsV1NotificationsGet(limit, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Flag a notification as hidden.  This will set the attribute `popup` to `false`.
     * @summary Hide Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApi
     */
    public hideNotificationV1NotificationsIdHidePost(id: string, options?: AxiosRequestConfig) {
        return ReceiverApiFp(this.configuration).hideNotificationV1NotificationsIdHidePost(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @summary Stream Notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReceiverApi
     */
    public streamNotificationsV1NotificationsStreamGet(options?: AxiosRequestConfig) {
        return ReceiverApiFp(this.configuration).streamNotificationsV1NotificationsStreamGet(options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * SenderApi - axios parameter creator
 * @export
 */
export const SenderApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Create one notification.  *Senders* are supposed to use this endpoint in order to submit a notification for a specific user.
         * @summary Create Notification
         * @param {NotificationCreate} notificationCreate
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createNotificationV1NotificationsPost: async (notificationCreate: NotificationCreate, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'notificationCreate' is not null or undefined
            assertParamExists('createNotificationV1NotificationsPost', 'notificationCreate', notificationCreate)
            const localVarPath = `/v1/notifications/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;



            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(notificationCreate, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
         * @summary Delete Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteNotificationV1NotificationsIdDelete: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteNotificationV1NotificationsIdDelete', 'id', id)
            const localVarPath = `/v1/notifications/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;



            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SenderApi - functional programming interface
 * @export
 */
export const SenderApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SenderApiAxiosParamCreator(configuration)
    return {
        /**
         * Create one notification.  *Senders* are supposed to use this endpoint in order to submit a notification for a specific user.
         * @summary Create Notification
         * @param {NotificationCreate} notificationCreate
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createNotificationV1NotificationsPost(notificationCreate: NotificationCreate, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<NotificationRead>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createNotificationV1NotificationsPost(notificationCreate, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
         * @summary Delete Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteNotificationV1NotificationsIdDelete(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteNotificationV1NotificationsIdDelete(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * SenderApi - factory interface
 * @export
 */
export const SenderApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SenderApiFp(configuration)
    return {
        /**
         * Create one notification.  *Senders* are supposed to use this endpoint in order to submit a notification for a specific user.
         * @summary Create Notification
         * @param {NotificationCreate} notificationCreate
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createNotificationV1NotificationsPost(notificationCreate: NotificationCreate, options?: any): AxiosPromise<NotificationRead> {
            return localVarFp.createNotificationV1NotificationsPost(notificationCreate, options).then((request) => request(axios, basePath));
        },
        /**
         * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
         * @summary Delete Notification
         * @param {string} id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteNotificationV1NotificationsIdDelete(id: string, options?: any): AxiosPromise<any> {
            return localVarFp.deleteNotificationV1NotificationsIdDelete(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * SenderApi - interface
 * @export
 * @interface SenderApi
 */
export interface SenderApiInterface {
    /**
     * Create one notification.  *Senders* are supposed to use this endpoint in order to submit a notification for a specific user.
     * @summary Create Notification
     * @param {NotificationCreate} notificationCreate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApiInterface
     */
    createNotificationV1NotificationsPost(notificationCreate: NotificationCreate, options?: AxiosRequestConfig): AxiosPromise<NotificationRead>;

    /**
     * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
     * @summary Delete Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApiInterface
     */
    deleteNotificationV1NotificationsIdDelete(id: string, options?: AxiosRequestConfig): AxiosPromise<any>;

}

/**
 * SenderApi - object-oriented interface
 * @export
 * @class SenderApi
 * @extends {BaseAPI}
 */
export class SenderApi extends BaseAPI implements SenderApiInterface {
    /**
     * Create one notification.  *Senders* are supposed to use this endpoint in order to submit a notification for a specific user.
     * @summary Create Notification
     * @param {NotificationCreate} notificationCreate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApi
     */
    public createNotificationV1NotificationsPost(notificationCreate: NotificationCreate, options?: AxiosRequestConfig) {
        return SenderApiFp(this.configuration).createNotificationV1NotificationsPost(notificationCreate, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Delete one notification  Allows to delete a notification. This is intended to be used in the following two cases:  1. A *Sender* can delete a notification if it is not valid anymore.    A *Sender* is only allowed to delete notifications which it did create    itself.  2. A *Receiver* can delete a notification if the user does want it to    disappear. A *Receiver* can only delete notifications which are targeted    to the user which it represents.
     * @summary Delete Notification
     * @param {string} id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApi
     */
    public deleteNotificationV1NotificationsIdDelete(id: string, options?: AxiosRequestConfig) {
        return SenderApiFp(this.configuration).deleteNotificationV1NotificationsIdDelete(id, options).then((request) => request(this.axios, this.basePath));
    }
}


