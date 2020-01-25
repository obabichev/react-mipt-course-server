import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import * as cookieParser from 'cookie-parser';
import {swaggerConnect} from '../swagger';
import * as helmet from "helmet";
import * as cors from "cors";


class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        const app = express();
        this.app = app;

        app.use(cors());
        app.use(helmet());

        app.use(express.static('public'));

        swaggerConnect(app, '/swagger');

        App.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();

    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private static connectToTheDatabase() {
        let uri = '';
        if (process.env.MONGODB_URI) {
            uri = process.env.MONGODB_URI;
        } else {
            const {
                MONGO_USER,
                MONGO_PASSWORD,
                MONGO_PATH,
            } = process.env;
            uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
        }

        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}

export default App;