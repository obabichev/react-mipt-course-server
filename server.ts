import 'reflect-metadata';
import 'dotenv/config';
import App from './src/app';
import PostsController from './src/posts/posts.controller';
import AuthenticationController from './src/authentication/authentication.controller';
import BoardController from './src/board/board.controller';
import DictionaryController from './src/dictionaries/dictionary.controller';

const app = new App(
    [
        new AuthenticationController(),
        new PostsController(),
        new BoardController(),
        new DictionaryController()
    ],
);

app.listen();
