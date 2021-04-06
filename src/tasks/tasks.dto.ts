import {IsInt, IsOptional, IsPositive, IsString, Length} from 'class-validator';

/**
 * @swagger
 * definitions:
 *   CreateTaskDto:
 *     title: string
 *     boardId: string
 *     description: string
 *     parentTaskId: string
 */
export class CreateTaskDto {
    @IsString()
    @Length(2, 255)
    public title: string;

    @IsString()
    public boardId: string;

    @IsString()
    public description: string;

    @IsOptional()
    @IsString()
    public parentTaskId: string;
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    public title: string;

    @IsOptional()
    @IsString()
    public description: string;

    @IsOptional()
    @IsString()
    public status: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    public estimation: number;
}