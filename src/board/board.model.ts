import * as mongoose from 'mongoose';
import User from '../user/user.interface';

export interface Board {
    title: string
}

export const boardSchema = new mongoose.Schema({
    title: String,
    owner: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    },
});

export const boardModel = mongoose.model<Board & mongoose.Document>('Board', boardSchema);
