import HttpException from './HttpException';

class BoardWithTheSameKeyAlreadyExistsException extends HttpException {
    constructor(key: string) {
        super(400, `Board with the key ${key} already exists`);
    }
}

export default BoardWithTheSameKeyAlreadyExistsException;