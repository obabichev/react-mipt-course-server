import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as express from 'express';

const options = {
    swaggerDefinition: {
        info: {
            title: 'test',
            version: '1.0.0',
            description: 'Hallo'
        },
        basePath: '/'
    },
    apis: ['src/**/*.ts']
};

const specs = swaggerJsdoc(options);

export const swaggerConnect = (app: express.Application, path: string) => {
    app.use(path, swaggerUi.serve, swaggerUi.setup(specs));
};