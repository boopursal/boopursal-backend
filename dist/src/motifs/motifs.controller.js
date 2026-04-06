"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotifsController = void 0;
const common_1 = require("@nestjs/common");
const motifs_service_1 = require("./motifs.service");
let MotifsController = class MotifsController {
    constructor(motifsService) {
        this.motifsService = motifsService;
    }
    findAll() {
        return this.motifsService.findAll();
    }
};
exports.MotifsController = MotifsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MotifsController.prototype, "findAll", null);
exports.MotifsController = MotifsController = __decorate([
    (0, common_1.Controller)('motifs'),
    __metadata("design:paramtypes", [motifs_service_1.MotifsService])
], MotifsController);
//# sourceMappingURL=motifs.controller.js.map