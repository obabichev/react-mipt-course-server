import 'reflect-metadata';
// import 'dotenv/config';
import App from './src/app';
import AuthenticationController from './src/authentication/authentication.controller';
import BoardController from './src/board/board.controller';
import DictionaryController from './src/dictionaries/dictionary.controller';
import TasksController from './src/tasks/tasks.controller';

const app = new App(
    [
        new AuthenticationController(),
        new BoardController(),
        new DictionaryController(),
        new TasksController()
    ],
);

app.listen();
