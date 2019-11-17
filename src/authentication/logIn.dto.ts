import {IsString} from 'class-validator';

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
class LogInDto {
    @IsString()
    public email: string;

    @IsString()
    public password: string;
}

export default LogInDto;