import {IsString} from 'class-validator';

class DictionaryDto {
    @IsString()
    public key: string;

    @IsString()
    public value: string;
}

export default DictionaryDto;