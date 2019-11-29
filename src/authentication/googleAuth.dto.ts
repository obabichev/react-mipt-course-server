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
class GoogleAuthDto {
    @IsString()
    public code: string;
}

export default GoogleAuthDto;