import HttpException from './HttpException';

class UserWasAlreadyRegisteredWithOtherServiceException extends HttpException {
    constructor() {
        super(400, 'User was already registered with other service');
    }
}

export default UserWasAlreadyRegisteredWithOtherServiceException;

