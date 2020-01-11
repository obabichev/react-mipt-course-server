import HttpException from './HttpException';

class WrongInputException extends HttpException {
    constructor(message: string) {
        super(400, message);
    }
}

export default WrongInputException;