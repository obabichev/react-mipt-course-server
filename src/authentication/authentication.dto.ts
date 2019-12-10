import {IsString} from 'class-validator';

/**
 * @swagger
 * definitions:
 *   GoogleAuthDto:
 *     type: object
 *     properties:
 *       code:
 *         type: string
 */
export class GoogleAuthDto {
    @IsString()
    public id_token: string;
}

/**
 * @swagger
 * definitions:
 *   LoginRequest:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */
export class LogInDto {
    @IsString()
    public email: string;

    @IsString()
    public password: string;
}

/**
 * @swagger
 * definitions:
 *   UpdateTokensDto:
 *     type: object
 *     properties:
 *       refreshToken:
 *         type: string
 */
export class UpdateTokensDto {
    @IsString()
    public refreshToken: string
}