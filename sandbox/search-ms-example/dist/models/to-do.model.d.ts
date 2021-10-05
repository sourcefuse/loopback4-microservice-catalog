import { Entity } from '@loopback/repository';
export declare class ToDo extends Entity {
    id?: string;
    name: string;
    description: string;
    constructor(data?: Partial<ToDo>);
}
export declare type ToDoWithRelations = ToDo;
