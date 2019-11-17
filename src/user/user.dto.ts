import { IsOptional, IsString, ValidateNested } from 'class-validator';
import CreateAddressDto from './address.dto';

/**
 * @swagger
 * definitions:
 *   CreateUser:
 *     type: object
 *     required:
 *       - name
 *       - email
 *       - password
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       address:
 *         type: string
 */
class CreateUserDto {
    @IsString()
    public name: string;

    @IsString()
    public email: string;

    @IsString()
    public password: string;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto;
}

export default CreateUserDto;