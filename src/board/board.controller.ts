import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import {boardModel} from './board.model';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreateBoardDto from './board.dto';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import {boardIcons, categories} from '../dictionaries/dictionary.controller';
import WrongInputException from '../exceptions/WrongInputException';
import HttpException from '../exceptions/HttpException';

class BoardController implements Controller {
    public path = '/board';
    public router = express.Router();
    private board = boardModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllBoards);
        this.router.get(`${this.path}/:id`, this.getBoardById);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .post(this.path, authMiddleware, validationMiddleware(CreateBoardDto), this.createBoard);
    }

    /**
     * @swagger
     * /api/board:
     *   get:
     *     summary: Returns list with all boards
     *     parameters:
     *       - name: limit
     *         in: query
     *         schema:
     *           type: integer
     *         required: false
     *         default: 25
     *       - name: offset
     *         in: query
     *         schema:
     *           type: integer
     *         required: false
     *         default: 0
     *     responses:
     *       '200':
     *         description: >
     *           List of boards.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/definitions/Board'
     *             example: {
     *               "_id": "",
     *               "title": "title",
     *               "key": "TTL",
     *               "category": {
     *                 "key": "tech",
     *                 "value": "Technology"
     *               },
     *               "icon": {
     *                 "key": "1",
     *                 "value": "..."
     *               },
     *               "owner": {
     *                   "_id": "",
     *                   "name": "",
     *                   "email": ""
     *               }
     *             }
     *
     */
    getAllBoards = async (request: express.Request, response: express.Response) => {
        const {limit, offset} = request.query;

        const boards = await this.board
            .find()
            .populate('owner', '-password  -oauth')
            .sort("title")
            .skip(Number.parseInt(offset) || 0)
            .limit(Number.parseInt(limit) || 25);
        response.send(boards);
    };

    /**
     * @swagger
     * /api/board/{id}:
     *   get:
     *     summary: Returns list with all boards
     *     parameters:
     *       - name: id
     *         in: path
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       '200':
     *         description: >
     *           Details of board.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/definitions/Board'
     *             example: {
     *               "_id": "",
     *               "title": "title",
     *               "key": "TTL",
     *               "category": {
     *                 "key": "tech",
     *                 "value": "Technology"
     *               },
     *               "icon": {
     *                 "key": "1",
     *                 "value": "..."
     *               },
     *               "owner": {
     *                   "_id": "",
     *                   "name": "",
     *                   "email": ""
     *               }
     *             }
     *
     */
    getBoardById = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const key = request.params.id;
        try {
            const board = await this.board.findById(key)
                .populate('owner', '-password')
                .populate('tasks');

            if (board) {
                return response.send(board);
            }
        } catch (e) {
        }
        try {
            const board = await this.board.findOne({key})
                .populate('owner', '-password')
                .populate('tasks');
            if (board) {
                return response.send(board);
            }
        } catch (e) {
        }

        return next(new HttpException(400, 'Board was not found'));
    };

    /**
     * @swagger
     * /api/board:
     *   post:
     *     summary: Create new Board (requires access token)
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/CreateBoardDto'
     *           example: {
     *             "title": "title",
     *             "key": "TTL",
     *             "category": {
     *               "key": "tech",
     *               "value": "Technology"
     *             },
     *             "icon": {
     *               "key": "1",
     *               "value": "..."
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
     *               "icon": {
     *                 "key": "1",
     *                 "value": "..."
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
    createBoard = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const boardData: CreateBoardDto = request.body;

        const key = boardData.key.toUpperCase();

        const category = boardData?.category?.key && categories.find(category => category.key === boardData.category.key);
        if (!category) {
            return next(new WrongInputException(`Category should belong to the list of available categories`));
        }

        const icon = boardData?.icon?.key && boardIcons.find(icon => icon.key === boardData.icon.key);
        if (!icon) {
            return next(new WrongInputException(`Board icon should belong to the list of available board icons`));
        }

        const createdBoard = new this.board({
            title: boardData.title,
            key,
            category,
            icon,
            owner: request.user._id,
        });

        const savedBoard = await createdBoard.save();
        await savedBoard.populate('owner', '-password').execPopulate();

        response.send(savedBoard);
    }
}

export default BoardController;