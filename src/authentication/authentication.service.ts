import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import CreateUserDto from '../user/user.dto';
import userModel from './../user/user.model';
import UserWasAlreadyRegisteredWithOtherServiceException
    from '../exceptions/UserWasAlreadyRegisteredWithOtherServiceException';

class AuthenticationService {
    public user = userModel;

    public async register(userData: CreateUserDto) {
        if (
            await this.user.findOne({email: userData.email})
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create({
            ...userData,
            password: hashedPassword,
        });
        user.password = undefined;
        const token = this.createToken(user);
        return {
            token,
            user,
        };
    }

    public createToken(user: { _id: string }): TokenData {

        const now = Date.now();
        const accessTokenExpiresIn = 60 * 60 * 1000; // an hour
        const refreshTokenExpiresIn = 60 * 60 * 24 * 30 * 6 * 1000; // about half year
        const secret = process.env.JWT_SECRET;
        const refreshSecret = process.env.JWT_REFRESH_SECRET;

        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };

        return {
            accessToken: jwt.sign(dataStoredInToken, secret, {expiresIn: accessTokenExpiresIn}),
            accessTokenExpiresIn: accessTokenExpiresIn + now,
            refreshToken: jwt.sign(dataStoredInToken, refreshSecret, {expiresIn: refreshTokenExpiresIn}),
            refreshTokenExpiresIn: refreshTokenExpiresIn + now
        };
    }

    public async oauthLoginOrRegistration(user: { name: string, email: string }, service: 'google') {
        const dbUser = await this.user.findOne({email: user.email});
        if (dbUser && dbUser.oauth === service) {
            const token = this.createToken(dbUser);
            return {
                token,
                user: dbUser
            };
        }
        if (dbUser && dbUser.oauth !== service) {
            throw new UserWasAlreadyRegisteredWithOtherServiceException();
        }

        const newUser = await this.user.create({
            name: user.name,
            email: user.email,
            oauth: service
        });
        const token = this.createToken(newUser);
        return {
            token,
            user: newUser,
        };
    }
}

export default AuthenticationService;