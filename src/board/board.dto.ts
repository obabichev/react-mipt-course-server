import {IsString} from 'class-validator';

class CreateBoardDto {
    @IsString()
    public title: string;
}


export default CreateBoardDto;