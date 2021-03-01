import { IServiceConfig } from '@sourceloop/core';

export interface IAuthServiceConfig extends IServiceConfig { }

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface preSignupFn<T = void> {
    (
        token: string,
        email: string
    ): Promise<T>;
}

export interface userSignupFn<T> {
    (
        model: T,
    ): Promise<T>
}
