import * as mongoose from 'mongoose';
import Post from './post.interface';

/**
 * @swagger
 * definitions:
 *   Post:
 *     type: object
 *     properties:
 *       author:
 *         type; string
 *       content:
 *         type; string
 *       title:
 *         type; string
 */
const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;