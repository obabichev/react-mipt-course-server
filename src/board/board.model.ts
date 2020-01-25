import * as mongoose from 'mongoose';
import User from '../user/user.interface';
import {Dictionary} from '../dictionaries/dictionary.model';

/**
 * @swagger
 * definitions:
 *   Board:
 *     title: string
 *     key: string
 *     owner:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         _id:
 *           string
 *     category:
 *      type: object
 *      properties:
 *       key:
 *         type: string
 *       value:
 *         type: string
 *     icon:
 *      type: object
 *      properties:
 *       key:
 *         type: string
 *       value:
 *         type: string
 */
export interface Board {
    title: string
    key: string
    category: Dictionary
    icon: Dictionary
    owner: User
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
    },
    icon: {
        key: String,
        value: String
    }
});

export const boardModel = mongoose.model<Board & mongoose.Document>('Board', boardSchema);
