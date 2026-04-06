"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SousSecteursModule = void 0;
const common_1 = require("@nestjs/common");
const sous_secteurs_controller_1 = require("./sous-secteurs.controller");
const sous_secteurs_service_1 = require("./sous-secteurs.service");
const prisma_module_1 = require("../prisma/prisma.module");
let SousSecteursModule = class SousSecteursModule {
};
exports.SousSecteursModule = SousSecteursModule;
exports.SousSecteursModule = SousSecteursModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [sous_secteurs_controller_1.SousSecteursController],
        providers: [sous_secteurs_service_1.SousSecteursService],
        exports: [sous_secteurs_service_1.SousSecteursService],
    })
], SousSecteursModule);
//# sourceMappingURL=sous-secteurs.module.js.map