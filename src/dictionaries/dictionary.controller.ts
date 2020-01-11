import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import {Dictionary} from './dictionary.model';

const categories: Dictionary[] = [
    {
        key: 'tech',
        value: 'Technology'
    },
    {
        key: 'finance',
        value: 'Finance'
    },
    {
        key: 'operations',
        value: 'Operations'
    },
    {
        key: 'revenue',
        value: 'Revenue'
    },
    {
        key: 'hr',
        value: 'HR'
    },
];

class DictionaryController implements Controller {
    public path = '/dictionaries';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/categories`, this.getCategories);
    }

    /**
     * @swagger
     * /dictionaries/categories:
     *   get:
     *     summary: Returns categories for Boards
     *     responses:
     *       '200':
     *         description: >
     *           List of categories.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 key:
     *                   type: string
     *                 value:
     *                   type: string
     *             example: [
     *                   {
     *                     key: "",
     *                     value: ""
     *                   }
     *                 ]
     *
     */
    private getCategories = async (request: RequestWithUser, response: express.Response) => {
        response.send(categories);
    }
}

export default DictionaryController;