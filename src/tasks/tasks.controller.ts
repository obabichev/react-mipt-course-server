import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import {tasksModel} from './tasks.model';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import {CreateTaskDto} from './tasks.dto';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import {boardModel} from '../board/board.model';
import WrongInputException from '../exceptions/WrongInputException';
import HttpException from '../exceptions/HttpException';

const statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE', 'CLOSED'];

class TasksController implements Controller {
    public path = '/task';
    public router = express.Router();
    private task = tasksModel;
    private board = boardModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllTasks);
        this.router.get(`${this.path}/:key`, this.getTaskByKeyOrId);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .post(this.path, authMiddleware, validationMiddleware(CreateTaskDto), this.createTask);
    }

    private getAllTasks = async (request: express.Request, response: express.Response) => {
        const tasks = await this.task
            .find()
            .populate('owner', '-password');
        response.send(tasks);
    };

    private createTask = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const {title, boardId, description}: CreateTaskDto = request.body;

        let board;

        try {
            board = await this.board.findById(boardId);
        } catch (e) {
            return next(new HttpException(500, e.message));
        }
        if (!board) {
            return next(new WrongInputException(`Should be specified existing board`));
        }

        const number = (await this.task.count({})) + 1;

        const key = `${board.key}-${number}`;

        const createdTask = new this.task({
            title,
            description,
            key,
            board: board._id,
            owner: request.user._id,
            comments: [],
            status: 'BACKLOG',
            estimation: 0,
            assignee: null
        });

        const savedTask = await createdTask.save();
        await savedTask.populate('owner', '-password').execPopulate();

        response.send(savedTask);
    };

    private getTaskByKeyOrId = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const key = request.params.key;
        try {
            const task = await this.task.findById(key);
            if (task) {
                return response.send(task);
            }
        } catch (e) {

        }
        try {
            const task = await this.task.findOne({key});
            if (task) {
                return response.send(task);
            }
        } catch (e) {

        }

        return next(new HttpException(400, 'Task was not found'));
    }
}

export default TasksController;