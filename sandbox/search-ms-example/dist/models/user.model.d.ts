import { Entity } from '@loopback/repository';
export declare class User extends Entity {
    username: string;
    id?: string;
    about: string;
    constructor(data?: Partial<User>);
}
export declare type UserWithRelations = User;
