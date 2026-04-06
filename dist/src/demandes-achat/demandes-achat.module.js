"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandesAchatModule = void 0;
const common_1 = require("@nestjs/common");
const demandes_achat_controller_1 = require("./demandes-achat.controller");
const demandes_achat_service_1 = require("./demandes-achat.service");
let DemandesAchatModule = class DemandesAchatModule {
};
exports.DemandesAchatModule = DemandesAchatModule;
exports.DemandesAchatModule = DemandesAchatModule = __decorate([
    (0, common_1.Module)({
        controllers: [demandes_achat_controller_1.DemandesAchatController],
        providers: [demandes_achat_service_1.DemandesAchatService],
    })
], DemandesAchatModule);
//# sourceMappingURL=demandes-achat.module.js.map