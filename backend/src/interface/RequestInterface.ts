import { Request } from 'express';

export interface RequestInterface<T> extends Partial<Request> {
    body: T;
}
