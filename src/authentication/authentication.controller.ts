import * as bcrypt from 'bcrypt';
import * as express from 'express';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';
import GoogleAuthDto from './googleAuth.dto';
import {getGoogleAccountFromCode} from '../../utils/google';

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();
    public authenticationService = new AuthenticationService();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        /**
         * @swagger
         * /auth/register:
         *   post:
         *     summary: Create new User
         *     requestBody:
         *       required: true
         *       description: A JSON object containing the name, email and password.
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/definitions/CreateUser'
         *           example: {
         *                 "name": "",
         *                 "email": "",
         *                 "password": ""
         *             }
         *     security: []
         *     responses:
         *       '200':
         *         description: >
         *           User created successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 token:
         *                   type: object
         *                   properties:
         *                     token:
         *                       type: string
         *                     expiresIn:
         *                       type: number
         *             example: {
         *                 token: {
         *                     token: "",
         *                     expiresIn: ""
         *                 },
         *             }
         */
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        /**
         * @swagger
         * /auth/login:
         *   post:
         *     summary: Log in and return auth token
         *     requestBody:
         *       required: true
         *       description: A JSON object containing the login and password.
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/definitions/LoginRequest'
         *           example: {
         *                 "email": "",
         *                 "password": ""
         *             }
         *     security: []
         *     responses:
         *       '200':
         *         description: >
         *           Successfully authenticated.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 token:
         *                   type: object
         *                   properties:
         *                     token:
         *                       type: string
         *                     expiresIn:
         *                       type: number
         *             example: {
         *                 token: {
         *                     token: "",
         *                     expiresIn: ""
         *                 },
         *             }
         *       '401':
         *         description: >
         *           Wrong credentials provided
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                 message:
         *                   type: string
         *             example: {
         *                 status: "401",
         *                 message: "Wrong credentials provided"
         *             }
         */
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        this.router.post(`${this.path}/google`, validationMiddleware(GoogleAuthDto), this.googleAuth)
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = request.body;
        try {
            const {
                token,
                user,
            } = await this.authenticationService.register(userData);
            response.send({
                token,
                user
            });
        } catch (error) {
            next(error);
        }
    };

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = request.body;
        const user = await this.user.findOne({email: logInData.email});
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                const token = this.authenticationService.createToken(user);
                response.send({
                    token,
                    user
                });
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    };

    private loggingOut = (request: express.Request, response: express.Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
    };

    private googleAuth = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const code = request.body.code;

            const user = await getGoogleAccountFromCode(code);

            const result = await this.authenticationService.oauthLoginOrRegistration(user, 'google');

            response.send(result);
        } catch (e) {
            next(e)
        }
    }
}

export default AuthenticationController;