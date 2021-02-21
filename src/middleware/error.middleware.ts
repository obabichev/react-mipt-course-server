import {NextFunction, Request, Response} from 'express';
import HttpException from '../exceptions/HttpException';
import ValidationException from '../exceptions/ValidationException';

function errorMiddleware(error: HttpException | ValidationException, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    const payload: any = {
        status,
        message,
    };

    if (error instanceof ValidationException) {
        payload.validation = error.validation;
    }

    console.log(`${status} ${request.method} ${request.path}`, error);

    response
        .status(status)
        .send(payload)
}

export default errorMiddleware;