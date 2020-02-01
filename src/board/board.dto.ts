import {IsString, Length, Validate, ValidateNested} from 'class-validator';
import DictionaryDto from '../dictionaries/dictionary.dto';
import {Type} from 'class-transformer';
import {UniqueBoardKeyValidation} from './board.validation';


/**
 * @swagger
 * definitions:
 *   CreateBoardDto:
 *     title: string
 *     key: string
 *     category:
 *      type: object
 *      properties:
 *       key:
 *         type: string
 *       value:
 *         type: string
 *     icon:
 *      type: object
 *      properties:
 *       key:
 *         type: string
 *       value:
 *         type: string
 */
class CreateBoardDto {
    @IsString()
    @Length(2, 255)
    public title: string;

    @IsString()
    @Length(2, 5)
    @Validate(UniqueBoardKeyValidation)
    public key: string;

    @ValidateNested()
    @Type(() => DictionaryDto)
    public category: DictionaryDto;

    @ValidateNested()
    @Type(() => DictionaryDto)
    public icon: DictionaryDto;
}


export default CreateBoardDto;