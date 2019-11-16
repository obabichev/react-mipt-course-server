import 'dotenv/config';
import App from './app';
import PostsController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './authentication/authentication.controller';
import BoardController from './board/board.controller';

validateEnv();

const app = new App(
    [
        new AuthenticationController(),
        new PostsController(),
        new BoardController(),
    ],
);

app.listen();