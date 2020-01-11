import {IsString, Length, ValidateNested} from 'class-validator';
import DictionaryDto from '../dictionaries/dictionary.dto';
import {Type} from 'class-transformer';

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
}


export default CreateBoardDto;