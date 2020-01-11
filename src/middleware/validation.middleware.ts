import {plainToClass} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return (req, res, next) => {
        validate(plainToClass(type, req.body), {skipMissingProperties})
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    next(new HttpException(400, parseError(errors)));
                } else {
                    next();
                }
            });
    };
}

function parseError(errors: ValidationError[]) {
    const result = {};

    errors.forEach(error => {
        if (error.constraints) {
            result[error.property] = Object.values(error.constraints);
        }

        if (error.children.length > 0) {
            result[error.property] = parseError(error.children);
        }
    });

    return result;
}

export default validationMiddleware;