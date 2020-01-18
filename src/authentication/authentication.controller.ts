import * as bcrypt from 'bcrypt';
import * as express from 'express';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import {GoogleAuthDto, LogInDto, UpdateTokensDto} from './authentication.dto';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import {getGoogleAccountFromCode} from '../../utils/google';
import GoogleAuthException from '../exceptions/GoogleAuthException';

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *   Tokens:
 *     type: object
 *     properties:
 *       accessToken:
 *         type: string
 *       accessTokenExpiresIn:
 *         type: number
 *       refreshToken:
 *         type: string
 *       refreshTokenExpiresIn:
 *         type: number
 *   AuthResponse:
 *     $ref: '#/definitions/Tokens'
 *   BadRequest:
 *     type: object
 *     properties:
 *       status:
 *         type: number
 *       message:
 *         type: string
 *
 */
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
         *               $ref: '#/definitions/AuthResponse'
         *             example: {
         *                 "accessToken": "...",
         *                 "accessTokenExpiresIn": 1576600000000,
         *                 "refreshToken": "...",
         *                 "refreshTokenExpiresIn": 1576620000000
         *             }
         *       '400':
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/BadRequest'
         *             example: {
         *                 "status": 400,
         *                 "message": "User with email already exists"
         *             }
         *
         *
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
         *               $ref: '#/definitions/AuthResponse'
         *             example: {
         *                 "accessToken": "...",
         *                 "accessTokenExpiresIn": 1576600000000,
         *                 "refreshToken": "...",
         *                 "refreshTokenExpiresIn": 1576620000000
         *             }
         *       '401':
         *         description: >
         *           Wrong credentials provided
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/BadRequest'
         *             example: {
         *                 status: "401",
         *                 message: "Wrong credentials provided"
         *             }
         */
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        /**
         * @swagger
         * /auth/google:
         *   post:
         *     summary: Login with Google id_token
         *     requestBody:
         *       required: true
         *       description: A JSON object containing the id_token.
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/definitions/GoogleAuthDto'
         *           example: {
         *             "id_token": "..."
         *           }
         *     security: []
         *     responses:
         *       '200':
         *         description: >
         *           Successfully authenticated.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/AuthResponse'
         *             example: {
         *                 "accessToken": "...",
         *                 "accessTokenExpiresIn": 1576600000000,
         *                 "refreshToken": "...",
         *                 "refreshTokenExpiresIn": 1576620000000
         *             }
         *       '400':
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/BadRequest'
         *             example: {
         *                 status: "400",
         *                 message: "Wrong number of segments in token: ..."
         *             }
         */
        this.router.post(`${this.path}/google`, validationMiddleware(GoogleAuthDto), this.googleAuth);
        /**
         * @swagger
         * /auth/update-tokens:
         *   post:
         *     summary: Update tokens by Refresh token
         *     requestBody:
         *       required: true
         *       description: A JSON object containing the refresh token.
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/definitions/UpdateTokensDto'
         *           example: {
         *             "refreshToken": "..."
         *           }
         *     security: []
         *     responses:
         *       '200':
         *         description: >
         *           Successfully authenticated.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/AuthResponse'
         *             example: {
         *                 "accessToken": "...",
         *                 "accessTokenExpiresIn": 1576600000000,
         *                 "refreshToken": "...",
         *                 "refreshTokenExpiresIn": 1576620000000
         *             }
         *       '401':
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/BadRequest'
         *             example: {
         *                 status: "401",
         *                 message: "Wrong authentication token"
         *             }
         */
        this.router.post(`${this.path}/update-tokens`, validationMiddleware(UpdateTokensDto), this.updateTokens);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = request.body;
        try {
            const {token} = await this.authenticationService.register(userData);
            response.send(token);
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
                response.send(token);
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
            const idToken = request.body.id_token;

            const user = await getGoogleAccountFromCode(idToken);

            const result = await this.authenticationService.oauthLoginOrRegistration(user, 'google');

            response.send(result.token);
        } catch (e) {
            next(new GoogleAuthException(e.message));
        }
    };

    private updateTokens = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const refreshToken = request.body.refreshToken;

        const secret = process.env.JWT_REFRESH_SECRET;

        try {
            const verificationResponse = jwt.verify(refreshToken, secret) as DataStoredInToken;
            const _id = verificationResponse._id;

            const tokens = this.authenticationService.createToken({_id});

            response.send(tokens);
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    }
}

export default AuthenticationController;