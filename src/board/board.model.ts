import * as mongoose from 'mongoose';

export interface Board {
    title: string
}

const boardSchema = new mongoose.Schema({
    title: String
});

export const boardModel = mongoose.model<Board & mongoose.Document>('Board', boardSchema);
