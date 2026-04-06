"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express = require("express");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: '*',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.use('/images', express.static((0, path_1.join)(process.cwd(), 'public/images')));
    app.use('/attachement', express.static((0, path_1.join)(process.cwd(), 'public/attachement')));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp;
}
let server;
module.exports = async (req, res) => {
    if (!server) {
        server = await bootstrap();
    }
    return server(req, res);
};
//# sourceMappingURL=main.js.map