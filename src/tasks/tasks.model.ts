import * as mongoose from 'mongoose';
import User from '../user/user.interface';
import {Board} from '../board/board.model';

export interface Task {
    _id: string;
    title: string;
    description: string,
    key: string,
    subtasks: Task[],
    comments: any[],
    status: String,
    estimation: number,
    assignee: User | string,
    board: Board | string,
    owner: User | string
}

const tasksSchema = new mongoose.Schema({
    title: String,
    description: String,
    owner: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    },
    key: String,
    subtasks: [{
        ref: 'Task',
        type: mongoose.Schema.Types.ObjectId,
    }],
    comments: [],
    status: String,
    estimation: Number,
    assignee: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    },
    board: {
        ref: 'Board',
        type: mongoose.Schema.Types.ObjectId,
    },
});

export const tasksModel = mongoose.model<Task & mongoose.Document>('Task', tasksSchema);