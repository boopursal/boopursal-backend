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
exports.ProduitsController = void 0;
const common_1 = require("@nestjs/common");
const produits_service_1 = require("./produits.service");
let ProduitsController = class ProduitsController {
    constructor(produitsService) {
        this.produitsService = produitsService;
    }
    findAll(query) {
        const page = +(query.page || 1);
        const limit = +(query.itemsPerPage || query.limit || 20);
        return this.produitsService.findAll(page, limit, query);
    }
    countByCategorie(query) {
        return this.produitsService.countByCategorie(query);
    }
    countByPays(query) {
        return this.produitsService.countByPays(query);
    }
    findOne(idOrSlug) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.produitsService.findOne(id);
        }
        return this.produitsService.findBySlug(idOrSlug);
    }
};
exports.ProduitsController = ProduitsController;
__decorate([
    (0, common_1.Get)('produits'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProduitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count_produit_categorie'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProduitsController.prototype, "countByCategorie", null);
__decorate([
    (0, common_1.Get)('count_produit_pays'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProduitsController.prototype, "countByPays", null);
__decorate([
    (0, common_1.Get)('produits/:idOrSlug'),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProduitsController.prototype, "findOne", null);
exports.ProduitsController = ProduitsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [produits_service_1.ProduitsService])
], ProduitsController);
//# sourceMappingURL=produits.controller.js.map