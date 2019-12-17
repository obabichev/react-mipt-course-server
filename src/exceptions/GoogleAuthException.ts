import HttpException from './HttpException';

class GoogleAuthException extends HttpException {
    constructor(message: string) {
        super(400, message);
    }
}

export default GoogleAuthException;