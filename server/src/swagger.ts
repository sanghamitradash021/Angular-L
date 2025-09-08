import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Recipe Sharing API',
            version: '1.0.0',
            description: 'API for managing users, recipes, ratings, and comments.',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/USERS',
                description: 'User API Server',
            },
            {
                url: 'http://localhost:3000/api/recipes',
                description: 'Recipe API Server',
            },
            {
                url: 'http://localhost:3000/api/ratings',
                description: 'Ratings API Server',
            },
            {
                url: 'http://localhost:3000/api/comments',
                description: 'Comments API Server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        './src/routes/userRoutes.ts',
        './src/routes/recipeRoutes.ts',
        './src/routes/ratingRoutes.ts',
        './src/routes/commentRoutes.ts',
    ],
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number): void => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "API Documentation",
    }));

    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });

    console.log(`📚 Docs available at http://localhost:${port}/docs`);
};
