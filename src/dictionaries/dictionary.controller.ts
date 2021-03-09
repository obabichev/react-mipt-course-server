import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import {Dictionary} from './dictionary.model';

export const categories: Dictionary[] = [
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

export const boardIcons = [
    {
        key: '1',
        value: '/images/board-logo/1.svg'
    },
    {
        key: '2',
        value: '/images/board-logo/2.svg'
    },
    {
        key: '3',
        value: '/images/board-logo/3.png'
    },
    {
        key: '4',
        value: '/images/board-logo/4.svg'
    },
    {
        key: '5',
        value: '/images/board-logo/5.svg'
    },
    {
        key: '6',
        value: '/images/board-logo/6.svg'
    },
    {
        key: '7',
        value: '/images/board-logo/7.svg'
    },
    {
        key: '8',
        value: '/images/board-logo/8.svg'
    },
    {
        key: '9',
        value: '/images/board-logo/9.svg'
    },
    {
        key: '10',
        value: '/images/board-logo/10.svg'
    },
    {
        key: '11',
        value: '/images/board-logo/11.svg'
    },
    {
        key: '12',
        value: '/images/board-logo/12.svg'
    },
    {
        key: '13',
        value: '/images/board-logo/13.svg'
    },
    {
        key: '14',
        value: '/images/board-logo/14.svg'
    },
    {
        key: '15',
        value: '/images/board-logo/15.svg'
    },
    {
        key: '16',
        value: '/images/board-logo/16.svg'
    },
    {
        key: '17',
        value: '/images/board-logo/17.svg'
    },
    {
        key: '18',
        value: '/images/board-logo/18.svg'
    },
    {
        key: '19',
        value: '/images/board-logo/19.svg'
    },
    {
        key: '20',
        value: '/images/board-logo/20.svg'
    },
    {
        key: '21',
        value: '/images/board-logo/21.svg'
    },
    {
        key: '22',
        value: '/images/board-logo/22.svg'
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
        this.router.get(`${this.path}/board-icons`, this.getBoardIcons);
    }

    /**
     * @swagger
     * /api/dictionaries/categories:
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
    };

    /**
     * @swagger
     * /api/dictionaries/board-icons:
     *   get:
     *     summary: Returns List of urls to Board icons
     *     responses:
     *       '200':
     *         description: >
     *           List of board icons.
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
     *                     key: "1",
     *                     value: "/images/board-logo/1.svg"
     *                   }
     *                 ]
     *
     */

    private getBoardIcons = async (request: RequestWithUser, response: express.Response) => {
        response.send(boardIcons);
    };
}

export default DictionaryController;