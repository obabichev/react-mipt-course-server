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

    /**
     * @swagger
     * /board:
     *   post:
     *     summary: Create new Board
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/CreateBoard'
     *           example: {
     *             "title": "title",
     *             "key": "TTL",
     *             "category": {
     *               "key": "tech",
     *               "value": "Technology"
     *             }
     *           }
     *     security: []
     *     responses:
     *       '200':
     *         description: >
     *           Successfully authenticated.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 title: string
     *                 key: string
     *                 category:
     *                   type: object
     *                   properties:
     *                     key:
     *                       type: string
     *                     value:
     *                       type: string
     *                 owner:
     *                   type: object
     *                   properties:
     *                     _id: string
     *                     name: string
     *                     email: string
     *             example: {
     *               "_id": "",
     *               "title": "title",
     *               "key": "TTL",
     *               "category": {
     *                 "key": "tech",
     *                 "value": "Technology"
     *               },
     *               "owner": {
     *                 "_id": "",
     *                 "name": "",
     *                 "email": "",
     *               },
     *             }
     *       '401':
     *         description: >
     *           Wrong credentials provided
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                 message:
     *                   type: string
     *             example: {
     *                 status: "401",
     *                 message: "Wrong credentials provided"
     *             }
     */
    createBoard = async (request: RequestWithUser, response: express.Response) => {
        const boardData: CreateBoardDto = request.body;
        //
        // const createdPost = new this.board({
        //     ...boardData,
        //     owner: request.user._id,
        //
        // });
        // const savedPost = await createdPost.save();
        // await savedPost.populate('owner', '-password').execPopulate();
        // response.send(savedPost);

        console.log('[obabichev] boardData', boardData);

        const createdBoard = new this.board({
            ...boardData,
            owner: request.user._id,

        });

        const savedBoard = await createdBoard.save();
        await savedBoard.populate('owner', '-password').execPopulate();

        response.send(savedBoard);
    }
}

export default BoardController;