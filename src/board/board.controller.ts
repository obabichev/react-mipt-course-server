import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import {boardModel} from './board.model';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from '../posts/post.dto';

class BoardController implements Controller {
    public path = '/board';
    public router = express.Router();
    private board = boardModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.get(this.path, this.getAllPosts);
        // this.router.get(`${this.path}/:id`, this.getPostById);
        // this.router
        //     .all(`${this.path}/*`, authMiddleware)
        //     .put(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
        //     .delete(`${this.path}/:id`, this.deletePost)
        //     .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }
}

export default BoardController;