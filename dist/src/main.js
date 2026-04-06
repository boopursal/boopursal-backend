"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express = require("express");
const path_1 = require("path");
async function bootstrap() {
    process.env.DATABASE_URL = "mysql://root:@127.0.0.1:3306/boopugbb_ha";
    process.env.PORT = "3333";
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.use('/images', express.static((0, path_1.join)(process.cwd(), 'public/images')));
    app.use('/attachement', express.static((0, path_1.join)(process.cwd(), 'public/attachement')));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const port = +process.env.PORT;
    await app.listen(port);
    console.log(`\n🚀 Backend NestJS démarré sur : http://localhost:${port}`);
    console.log(`📂 Modèle de données : 60 tables MySQL synchronisées via Prisma`);
}
bootstrap();
//# sourceMappingURL=main.js.map