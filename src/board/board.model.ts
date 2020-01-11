import * as mongoose from 'mongoose';
import User from '../user/user.interface';
import {Dictionary} from '../dictionaries/dictionary.model';

export interface Board {
    title: string
    key: string
    category: Dictionary
}

export const boardSchema = new mongoose.Schema({
    title: String,
    owner: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    },
    key: String,
    category: {
        key: String,
        value: String
    }
});

export const boardModel = mongoose.model<Board & mongoose.Document>('Board', boardSchema);
