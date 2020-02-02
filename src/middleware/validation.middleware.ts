import {plainToClass} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import * as express from 'express';
import ValidationException from '../exceptions/ValidationException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return (req, res, next) => {
        validate(plainToClass(type, req.body), {skipMissingProperties})
            .then((errors: ValidationError[]) => {
                console.log('[obabichev] error', errors);
                if (errors.length > 0) {
                    next(new ValidationException(parseError(errors)));
                } else {
                    next();
                }
            });
    };
}

function parseError(errors: ValidationError[]) {
    const result = {};

    const flattenErrors = (parsed: any) => {
        let result = [];

        const flattenErrorsRec = (part) => {
            Object.keys(part).forEach(key => {
                if (part[key].messages) {
                    result = [...result, ...part[key].messages];
                }
                if (part[key].nested) {
                    flattenErrorsRec(part[key].nested);
                }
            });
        };

        flattenErrorsRec(parsed);
        return result;
    };

    errors.forEach(error => {
        if (error.constraints) {
            result[error.property] = {
                messages: Object.values(error.constraints)
            }
        }

        if (error.children && error.children.length > 0) {
            const attributes = parseError(error.children);
            result[error.property] = {
                messages: flattenErrors(attributes),
                attributes
            }
        }
    });

    return result;
}

export default validationMiddleware;