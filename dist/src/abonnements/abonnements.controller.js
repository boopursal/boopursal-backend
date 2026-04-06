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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbonnementsController = void 0;
const common_1 = require("@nestjs/common");
const abonnements_service_1 = require("./abonnements.service");
let AbonnementsController = class AbonnementsController {
    constructor(abonnementsService) {
        this.abonnementsService = abonnementsService;
    }
    findAll(page = '1', limit = '20', search) {
        return this.abonnementsService.findAll(+page, +limit, []);
    }
    getStats() {
        return this.abonnementsService.getStats();
    }
    findOne(id) {
        return this.abonnementsService.findOne(id);
    }
};
exports.AbonnementsController = AbonnementsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], AbonnementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AbonnementsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AbonnementsController.prototype, "findOne", null);
exports.AbonnementsController = AbonnementsController = __decorate([
    (0, common_1.Controller)('abonnements'),
    __metadata("design:paramtypes", [abonnements_service_1.AbonnementsService])
], AbonnementsController);
//# sourceMappingURL=abonnements.controller.js.map