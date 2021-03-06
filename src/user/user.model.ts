import * as mongoose from 'mongoose';
import User from './user.interface';

export const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    oauth: String
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;