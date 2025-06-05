import { Response } from 'express';

export interface ResponseInterface<T> extends Partial<Response> {
    success: boolean;
    data?: T;
    errors?: string[];
}
