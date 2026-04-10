"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express = require("express");
const path_1 = require("path");
let cachedApp = null;
async function bootstrap() {
    if (cachedApp)
        return cachedApp;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
        credentials: true,
    });
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.use('/images', express.static((0, path_1.join)(process.cwd(), 'public/images')));
    app.use('/attachement', express.static((0, path_1.join)(process.cwd(), 'public/attachement')));
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
    return cachedApp;
}
exports.default = async (req, res) => {
    const handler = await bootstrap();
    return handler(req, res);
};
//# sourceMappingURL=main.js.map