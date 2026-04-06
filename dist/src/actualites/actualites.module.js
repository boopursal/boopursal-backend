"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualitesModule = void 0;
const common_1 = require("@nestjs/common");
const actualites_service_1 = require("./actualites.service");
const actualites_controller_1 = require("./actualites.controller");
let ActualitesModule = class ActualitesModule {
};
exports.ActualitesModule = ActualitesModule;
exports.ActualitesModule = ActualitesModule = __decorate([
    (0, common_1.Module)({
        providers: [actualites_service_1.ActualitesService],
        controllers: [actualites_controller_1.ActualitesController]
    })
], ActualitesModule);
//# sourceMappingURL=actualites.module.js.map