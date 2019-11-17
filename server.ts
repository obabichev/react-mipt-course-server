import 'dotenv/config';
import App from './src/app';
import PostsController from './src/posts/posts.controller';
import validateEnv from './src/utils/validateEnv';
import AuthenticationController from './src/authentication/authentication.controller';
import BoardController from './src/board/board.controller';

validateEnv();

const app = new App(
    [
        new AuthenticationController(),
        new PostsController(),
        new BoardController(),
    ],
);

app.listen();
