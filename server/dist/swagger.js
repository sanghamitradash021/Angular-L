"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
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
const specs = (0, swagger_jsdoc_1.default)(options);
const swaggerDocs = (app, port) => {
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "API Documentation",
    }));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
    console.log(`📚 Docs available at http://localhost:${port}/docs`);
};
exports.swaggerDocs = swaggerDocs;
