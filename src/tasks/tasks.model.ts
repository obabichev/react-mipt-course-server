import * as mongoose from 'mongoose';
import User from '../user/user.interface';

export interface Task {
    owner: User
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