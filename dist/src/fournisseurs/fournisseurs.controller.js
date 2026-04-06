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
exports.FournisseursController = void 0;
const common_1 = require("@nestjs/common");
const fournisseurs_service_1 = require("./fournisseurs.service");
let FournisseursController = class FournisseursController {
    constructor(fournisseursService) {
        this.fournisseursService = fournisseursService;
    }
    findAll(query) {
        const page = +(query.page || 1);
        const limit = +(query.itemsPerPage || query.limit || 20);
        return this.fournisseursService.findAll(page, limit, query);
    }
    countByCategorie(query) {
        return this.fournisseursService.countByCategorie(query);
    }
    countByPays(query) {
        return this.fournisseursService.countByPays(query);
    }
    getStats() {
        return this.fournisseursService.getStats();
    }
    findOne(idOrSlug) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.fournisseursService.findOne(id);
        }
        return this.fournisseursService.findBySlug(idOrSlug);
    }
    update(idOrSlug, data) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id))
            return null;
        return this.fournisseursService.update(id, data);
    }
    async getAbonnements(idOrSlug, order) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id))
            return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { expired: 'desc' };
        return this.fournisseursService.getAbonnements(id, orderBy);
    }
    async getBlackListes(idOrSlug, order) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id))
            return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { created: 'desc' };
        return this.fournisseursService.getBlackListes(id, orderBy);
    }
    async getJetons(idOrSlug, order) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id))
            return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { created: 'desc' };
        return this.fournisseursService.getJetons(id, orderBy);
    }
    async getProduits(idOrSlug, page = '1', limit = '20', order) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id))
            return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { created: 'desc' };
        return this.fournisseursService.getProduits(id, +page, +limit, orderBy);
    }
};
exports.FournisseursController = FournisseursController;
__decorate([
    (0, common_1.Get)('fournisseurs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FournisseursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count_fournisseur_categorie'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FournisseursController.prototype, "countByCategorie", null);
__decorate([
    (0, common_1.Get)('count_fournisseur_pays'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FournisseursController.prototype, "countByPays", null);
__decorate([
    (0, common_1.Get)('fournisseurs/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FournisseursController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('fournisseurs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FournisseursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('fournisseurs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FournisseursController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('fournisseurs/:id/abonnements'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FournisseursController.prototype, "getAbonnements", null);
__decorate([
    (0, common_1.Get)('fournisseurs/:id/blacklistes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FournisseursController.prototype, "getBlackListes", null);
__decorate([
    (0, common_1.Get)('fournisseurs/:id/jetons'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FournisseursController.prototype, "getJetons", null);
__decorate([
    (0, common_1.Get)('fournisseurs/:id/produits'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FournisseursController.prototype, "getProduits", null);
exports.FournisseursController = FournisseursController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [fournisseurs_service_1.FournisseursService])
], FournisseursController);
//# sourceMappingURL=fournisseurs.controller.js.map