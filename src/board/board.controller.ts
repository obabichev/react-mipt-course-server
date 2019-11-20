import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import {boardModel} from './board.model';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreateBoardDto from './board.dto';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class BoardController implements Controller {
    public path = '/board';
    public router = express.Router();
    private board = boardModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllBoards);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .post(this.path, authMiddleware, validationMiddleware(CreateBoardDto), this.createBoard);
    }

    getAllBoards = async (request: express.Request, response: express.Response) => {
        const boards = await this.board
            .find()
            .populate('owner', '-password');
        response.send(boards);
    };

    createBoard = async (request: RequestWithUser, response: express.Response) => {
        const boardData: CreateBoardDto = request.body;

        const createdPost = new this.board({
            ...boardData,
            owner: request.user._id,

        });
        const savedPost = await createdPost.save();
        await savedPost.populate('owner', '-password').execPopulate();
        response.send(savedPost);
    }
}

export default BoardController;