class ValidationException extends Error {
    status: number;
    validation: any;
    message: any;

    constructor(validation: any) {
        super('Validation error');
        this.status = 400;
        this.message = 'Validation error';
        this.validation = validation;
    }
}

export default ValidationException;