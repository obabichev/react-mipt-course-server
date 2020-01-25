import {IsString, Length, ValidateNested} from 'class-validator';
import DictionaryDto from '../dictionaries/dictionary.dto';
import {Type} from 'class-transformer';


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
    public key: string;

    @ValidateNested()
    @Type(() => DictionaryDto)
    public category: DictionaryDto;

    @ValidateNested()
    @Type(() => DictionaryDto)
    public icon: DictionaryDto;
}


export default CreateBoardDto;