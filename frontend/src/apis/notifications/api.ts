/* tslint:disable */
/* eslint-disable */
/**
 * Notifications API
 *  The Notifications API is intended to be used so that applications can send notifications so that they are visible within the Univention Portal.  The API endpoints can be grouped as follows:  - *Notification Sender API* -- This subset of endpoints is intended to be used   by applications who want to send a notification for a given user.  - *Notification Client API* -- This subset shall fulfill the needs of the   Univention Portal, so that it can show the notifications to the user.  Note: The groups are not necessarily disjoint. 
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
 * 
 * @export
 * @interface LocationInner
 */
export interface LocationInner {
}
/**
 * 
 * @export
 * @interface Notification
 */
export interface Notification {
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'sourceUid': string;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'targetUid': string;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'title': string;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'details': string;
    /**
     * 
     * @type {NotificationSeverity}
     * @memberof Notification
     */
    'severity': NotificationSeverity;
    /**
     * 
     * @type {boolean}
     * @memberof Notification
     */
    'sticky'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Notification
     */
    'needsConfirmation'?: boolean;
    /**
     * 
     * @type {NotificationType}
     * @memberof Notification
     */
    'notificationType': NotificationType;
    /**
     * 
     * @type {object}
     * @memberof Notification
     */
    'data'?: object;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'receiveTime': string;
    /**
     * 
     * @type {boolean}
     * @memberof Notification
     */
    'popup'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'readTime'?: string;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'sseSendTime'?: string;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'confirmationTime'?: string;
    /**
     * 
     * @type {string}
     * @memberof Notification
     */
    'expireTime'?: string;
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
     * 
     * @type {string}
     * @memberof NotificationCreate
     */
    'title': string;
    /**
     * 
     * @type {string}
     * @memberof NotificationCreate
     */
    'details': string;
    /**
     * 
     * @type {NotificationSeverity}
     * @memberof NotificationCreate
     */
    'severity': NotificationSeverity;
    /**
     * 
     * @type {boolean}
     * @memberof NotificationCreate
     */
    'sticky'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof NotificationCreate
     */
    'needsConfirmation'?: boolean;
    /**
     * 
     * @type {NotificationType}
     * @memberof NotificationCreate
     */
    'notificationType': NotificationType;
    /**
     * 
     * @type {object}
     * @memberof NotificationCreate
     */
    'data'?: object;
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
 * An enumeration.
 * @export
 * @enum {string}
 */

export const NotificationType = {
    Event: 'event',
    Announcement: 'announcement',
    Alert: 'alert'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];


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
 * ClientApi - axios parameter creator
 * @export
 */
export const ClientApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Read the notifications of the current user.
         * @summary Get Notifications
         * @param {string} [limit] 
         * @param {string} [type] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationsV1NotificationsGet: async (limit?: string, type?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
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

            if (type !== undefined) {
                localVarQueryParameter['type'] = type;
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
         * @summary Mark Notification Confirmed
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markNotificationConfirmedV1NotificationsIdConfirmPost: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('markNotificationConfirmedV1NotificationsIdConfirmPost', 'id', id)
            const localVarPath = `/v1/notifications/{id}/confirm`
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
         * @summary Mark Notification Read
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markNotificationReadV1NotificationsIdReadPost: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('markNotificationReadV1NotificationsIdReadPost', 'id', id)
            const localVarPath = `/v1/notifications/{id}/read`
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
 * ClientApi - functional programming interface
 * @export
 */
export const ClientApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ClientApiAxiosParamCreator(configuration)
    return {
        /**
         * Read the notifications of the current user.
         * @summary Get Notifications
         * @param {string} [limit] 
         * @param {string} [type] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getNotificationsV1NotificationsGet(limit?: string, type?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Notification>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getNotificationsV1NotificationsGet(limit, type, options);
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
         * @summary Mark Notification Confirmed
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markNotificationConfirmedV1NotificationsIdConfirmPost(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Notification>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.markNotificationConfirmedV1NotificationsIdConfirmPost(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Mark Notification Read
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async markNotificationReadV1NotificationsIdReadPost(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Notification>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.markNotificationReadV1NotificationsIdReadPost(id, options);
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
 * ClientApi - factory interface
 * @export
 */
export const ClientApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ClientApiFp(configuration)
    return {
        /**
         * Read the notifications of the current user.
         * @summary Get Notifications
         * @param {string} [limit] 
         * @param {string} [type] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationsV1NotificationsGet(limit?: string, type?: string, options?: any): AxiosPromise<Array<Notification>> {
            return localVarFp.getNotificationsV1NotificationsGet(limit, type, options).then((request) => request(axios, basePath));
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
         * @summary Mark Notification Confirmed
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markNotificationConfirmedV1NotificationsIdConfirmPost(id: string, options?: any): AxiosPromise<Notification> {
            return localVarFp.markNotificationConfirmedV1NotificationsIdConfirmPost(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Mark Notification Read
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        markNotificationReadV1NotificationsIdReadPost(id: string, options?: any): AxiosPromise<Notification> {
            return localVarFp.markNotificationReadV1NotificationsIdReadPost(id, options).then((request) => request(axios, basePath));
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
 * ClientApi - interface
 * @export
 * @interface ClientApi
 */
export interface ClientApiInterface {
    /**
     * Read the notifications of the current user.
     * @summary Get Notifications
     * @param {string} [limit] 
     * @param {string} [type] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApiInterface
     */
    getNotificationsV1NotificationsGet(limit?: string, type?: string, options?: AxiosRequestConfig): AxiosPromise<Array<Notification>>;

    /**
     * Flag a notification as hidden.  This will set the attribute `popup` to `false`.
     * @summary Hide Notification
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApiInterface
     */
    hideNotificationV1NotificationsIdHidePost(id: string, options?: AxiosRequestConfig): AxiosPromise<any>;

    /**
     * 
     * @summary Mark Notification Confirmed
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApiInterface
     */
    markNotificationConfirmedV1NotificationsIdConfirmPost(id: string, options?: AxiosRequestConfig): AxiosPromise<Notification>;

    /**
     * 
     * @summary Mark Notification Read
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApiInterface
     */
    markNotificationReadV1NotificationsIdReadPost(id: string, options?: AxiosRequestConfig): AxiosPromise<Notification>;

    /**
     * 
     * @summary Stream Notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApiInterface
     */
    streamNotificationsV1NotificationsStreamGet(options?: AxiosRequestConfig): AxiosPromise<any>;

}

/**
 * ClientApi - object-oriented interface
 * @export
 * @class ClientApi
 * @extends {BaseAPI}
 */
export class ClientApi extends BaseAPI implements ClientApiInterface {
    /**
     * Read the notifications of the current user.
     * @summary Get Notifications
     * @param {string} [limit] 
     * @param {string} [type] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApi
     */
    public getNotificationsV1NotificationsGet(limit?: string, type?: string, options?: AxiosRequestConfig) {
        return ClientApiFp(this.configuration).getNotificationsV1NotificationsGet(limit, type, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Flag a notification as hidden.  This will set the attribute `popup` to `false`.
     * @summary Hide Notification
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApi
     */
    public hideNotificationV1NotificationsIdHidePost(id: string, options?: AxiosRequestConfig) {
        return ClientApiFp(this.configuration).hideNotificationV1NotificationsIdHidePost(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Mark Notification Confirmed
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApi
     */
    public markNotificationConfirmedV1NotificationsIdConfirmPost(id: string, options?: AxiosRequestConfig) {
        return ClientApiFp(this.configuration).markNotificationConfirmedV1NotificationsIdConfirmPost(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Mark Notification Read
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApi
     */
    public markNotificationReadV1NotificationsIdReadPost(id: string, options?: AxiosRequestConfig) {
        return ClientApiFp(this.configuration).markNotificationReadV1NotificationsIdReadPost(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Stream Notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientApi
     */
    public streamNotificationsV1NotificationsStreamGet(options?: AxiosRequestConfig) {
        return ClientApiFp(this.configuration).streamNotificationsV1NotificationsStreamGet(options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * SenderApi - axios parameter creator
 * @export
 */
export const SenderApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * NOT YET IMPLEMENTED  The bulk notification endpoint shall allow a sender to invalidate a list of notifications. See the endpoint `notifications/{id}/invalidate` regagrding further details.
         * @summary Bulk Invalidate Notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bulkInvalidateNotificationsV1NotificationsInvalidatePost: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/notifications/invalidate`;
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
         * NOT YET IMPLEMENTED  The invalidation endpoint allows to invalidate a single notification.  The sending application is expected to use this endpoint if a notification is not relevant anymore from the perspective of a sender.
         * @summary Invalidate Notification
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        invalidateNotificationV1NotificationsIdInvalidatePost: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('invalidateNotificationV1NotificationsIdInvalidatePost', 'id', id)
            const localVarPath = `/v1/notifications/{id}/invalidate`
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
         * NOT YET IMPLEMENTED  The bulk notification endpoint shall allow a sender to invalidate a list of notifications. See the endpoint `notifications/{id}/invalidate` regagrding further details.
         * @summary Bulk Invalidate Notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bulkInvalidateNotificationsV1NotificationsInvalidatePost(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.bulkInvalidateNotificationsV1NotificationsInvalidatePost(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Create Notification
         * @param {NotificationCreate} notificationCreate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createNotificationV1NotificationsPost(notificationCreate: NotificationCreate, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Notification>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createNotificationV1NotificationsPost(notificationCreate, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * NOT YET IMPLEMENTED  The invalidation endpoint allows to invalidate a single notification.  The sending application is expected to use this endpoint if a notification is not relevant anymore from the perspective of a sender.
         * @summary Invalidate Notification
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async invalidateNotificationV1NotificationsIdInvalidatePost(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.invalidateNotificationV1NotificationsIdInvalidatePost(id, options);
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
         * NOT YET IMPLEMENTED  The bulk notification endpoint shall allow a sender to invalidate a list of notifications. See the endpoint `notifications/{id}/invalidate` regagrding further details.
         * @summary Bulk Invalidate Notifications
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bulkInvalidateNotificationsV1NotificationsInvalidatePost(options?: any): AxiosPromise<any> {
            return localVarFp.bulkInvalidateNotificationsV1NotificationsInvalidatePost(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Create Notification
         * @param {NotificationCreate} notificationCreate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createNotificationV1NotificationsPost(notificationCreate: NotificationCreate, options?: any): AxiosPromise<Notification> {
            return localVarFp.createNotificationV1NotificationsPost(notificationCreate, options).then((request) => request(axios, basePath));
        },
        /**
         * NOT YET IMPLEMENTED  The invalidation endpoint allows to invalidate a single notification.  The sending application is expected to use this endpoint if a notification is not relevant anymore from the perspective of a sender.
         * @summary Invalidate Notification
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        invalidateNotificationV1NotificationsIdInvalidatePost(id: string, options?: any): AxiosPromise<any> {
            return localVarFp.invalidateNotificationV1NotificationsIdInvalidatePost(id, options).then((request) => request(axios, basePath));
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
     * NOT YET IMPLEMENTED  The bulk notification endpoint shall allow a sender to invalidate a list of notifications. See the endpoint `notifications/{id}/invalidate` regagrding further details.
     * @summary Bulk Invalidate Notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApiInterface
     */
    bulkInvalidateNotificationsV1NotificationsInvalidatePost(options?: AxiosRequestConfig): AxiosPromise<any>;

    /**
     * 
     * @summary Create Notification
     * @param {NotificationCreate} notificationCreate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApiInterface
     */
    createNotificationV1NotificationsPost(notificationCreate: NotificationCreate, options?: AxiosRequestConfig): AxiosPromise<Notification>;

    /**
     * NOT YET IMPLEMENTED  The invalidation endpoint allows to invalidate a single notification.  The sending application is expected to use this endpoint if a notification is not relevant anymore from the perspective of a sender.
     * @summary Invalidate Notification
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApiInterface
     */
    invalidateNotificationV1NotificationsIdInvalidatePost(id: string, options?: AxiosRequestConfig): AxiosPromise<any>;

}

/**
 * SenderApi - object-oriented interface
 * @export
 * @class SenderApi
 * @extends {BaseAPI}
 */
export class SenderApi extends BaseAPI implements SenderApiInterface {
    /**
     * NOT YET IMPLEMENTED  The bulk notification endpoint shall allow a sender to invalidate a list of notifications. See the endpoint `notifications/{id}/invalidate` regagrding further details.
     * @summary Bulk Invalidate Notifications
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApi
     */
    public bulkInvalidateNotificationsV1NotificationsInvalidatePost(options?: AxiosRequestConfig) {
        return SenderApiFp(this.configuration).bulkInvalidateNotificationsV1NotificationsInvalidatePost(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
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
     * NOT YET IMPLEMENTED  The invalidation endpoint allows to invalidate a single notification.  The sending application is expected to use this endpoint if a notification is not relevant anymore from the perspective of a sender.
     * @summary Invalidate Notification
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SenderApi
     */
    public invalidateNotificationV1NotificationsIdInvalidatePost(id: string, options?: AxiosRequestConfig) {
        return SenderApiFp(this.configuration).invalidateNotificationV1NotificationsIdInvalidatePost(id, options).then((request) => request(this.axios, this.basePath));
    }
}


