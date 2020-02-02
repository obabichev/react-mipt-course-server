import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import {Task, tasksModel} from './tasks.model';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import {CreateTaskDto, UpdateTaskDto} from './tasks.dto';
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
            .post(this.path, authMiddleware, validationMiddleware(CreateTaskDto), this.createTask)
            .put(`${this.path}/:id`, authMiddleware, validationMiddleware(UpdateTaskDto), this.updateTask)
    }

    private getAllTasks = async (request: express.Request, response: express.Response) => {
        const tasks = await this.task
            .find()
            .populate('owner', '-password');
        response.send(tasks);
    };

    private createTask = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const {title, boardId, description, parentTaskId}: CreateTaskDto = request.body;

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

        const body: Partial<Task> = {
            title,
            description,
            key,
            board: board._id,
            owner: request.user._id,
            comments: [],
            status: 'BACKLOG',
            estimation: 0,
            assignee: null
        };

        if (parentTaskId) {
            let parent: Task;
            try {
                parent = await this.task.findById(parentTaskId);
            } catch (e) {
                return next(new HttpException(500, e.message));
            }
            if (!parent) {
                return next(new HttpException(400, 'Parent task was not found'));
            }
            // @ts-ignore
            if (!parent.board.equals(board._id)) {
                return next(new HttpException(400, 'Parent task and new task should belong to the same board'));
            }
            body.parent = parent._id;
        }

        const createdTask = new this.task(body);

        const savedTask = await createdTask.save();

        if (parentTaskId) {
            await this.task.findByIdAndUpdate(
                parentTaskId,
                {$push: {subtasks: savedTask._id}},
                {new: true, useFindAndModify: false}
            )
        }
        await savedTask
            .populate('owner', '-password')
            .execPopulate();

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
    };

    private updateTask = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const {title, description, status, estimation}: UpdateTaskDto = request.body;

        const original = await this.task.findById(id);
        if (!original) {
            next(new WrongInputException(`Task with id ${id} was not found`));
        }

        const patch: Partial<Task> = {};
        if (title) {
            patch.title = title;
        }
        if (description) {
            patch.description = description;
        }
        if (estimation) {
            patch.estimation = estimation;
        }

        if (status) {
            if (statuses.indexOf(status) !== -1 && (original.status === status || original.status !== 'DONE' && original.status !== 'CLOSED')) {
                patch.status = status;
            } else {
                return next(new WrongInputException('Status should be BACKLOG, TODO, IN_PROGRESS, DONE or CLOSED. Also status of closed and done tasks may not be changed'));
            }
        }

        try {
            await this.task.updateOne({_id: id}, patch);
            const result = await this.task.findById(id);
            response.send(result);
        } catch (e) {
            next(new HttpException(500, e.message));
        }
    }
}

export default TasksController;