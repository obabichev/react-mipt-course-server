import {IsString, Length} from 'class-validator';

/**
 * @swagger
 * definitions:
 *   CreateTaskDto:
 *     title: string
 *     boardId: string
 */
export class CreateTaskDto {
    @IsString()
    @Length(2, 255)
    public title: string;

    @IsString()
    public boardId: string;

    @IsString()
    public description: string;
}

export class UpdateTaskDto {
    public title: string;

    public description: string;

    public status: string;
}