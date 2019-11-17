import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as express from 'express';

const options = {
    "openapi": "3.0.0",
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            title: 'Mini Jira',
            version: '1.0.0',
            description: 'Final project of the MIPT React course'
        },
        basePath: '/',
        components: {
            securitySchemes: {
                bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearer: []
        }]
    },
    apis: ['src/**/*.ts']
};

const specs = swaggerJsdoc(options);

export const swaggerConnect = (app: express.Application, path: string) => {
    app.use(path, swaggerUi.serve, swaggerUi.setup(specs));
};