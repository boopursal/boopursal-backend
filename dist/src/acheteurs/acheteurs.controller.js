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
exports.AcheteursController = void 0;
const common_1 = require("@nestjs/common");
const acheteurs_service_1 = require("./acheteurs.service");
let AcheteursController = class AcheteursController {
    constructor(acheteursService) {
        this.acheteursService = acheteursService;
    }
    async findAll(page = '1', limit = '20', search) {
        try {
            return await this.acheteursService.findAll(+page, +limit, search);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Erreur serveur lors de la récupération des acheteurs', detail: error?.message });
        }
    }
    async create(data) {
        console.log('[AcheteursController.create] Body keys received:', Object.keys(data || {}));
        try {
            return await this.acheteursService.create(data);
        }
        catch (error) {
            console.error('[AcheteursController.create] Error:', error?.message);
            if (error?.isValidation) {
                throw new common_1.BadRequestException({ Erreur: error.message });
            }
            if (error?.isDb) {
                throw new common_1.InternalServerErrorException({ Erreur: error.message });
            }
            throw new common_1.BadRequestException({ Erreur: error?.message || 'Erreur inconnue' });
        }
    }
    getStats() {
        return this.acheteursService.getStats();
    }
    findOne(id) {
        return this.acheteursService.findOne(id);
    }
    update(id, data) {
        return this.acheteursService.update(id, data);
    }
    toggleStatut(id, statut) {
        return this.acheteursService.toggleStatut(id, statut);
    }
};
exports.AcheteursController = AcheteursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AcheteursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AcheteursController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcheteursController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AcheteursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AcheteursController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/statut'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('statut')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", void 0)
], AcheteursController.prototype, "toggleStatut", null);
exports.AcheteursController = AcheteursController = __decorate([
    (0, common_1.Controller)('acheteurs'),
    __metadata("design:paramtypes", [acheteurs_service_1.AcheteursService])
], AcheteursController);
//# sourceMappingURL=acheteurs.controller.js.map