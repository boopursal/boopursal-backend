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
exports.SecteursController = void 0;
const common_1 = require("@nestjs/common");
const secteurs_service_1 = require("./secteurs.service");
let SecteursController = class SecteursController {
    constructor(secteursService) {
        this.secteursService = secteursService;
    }
    create(data) {
        return this.secteursService.create(data);
    }
    findAll(page = '1', limit = '50', pagination, search, name) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.secteursService.findAll(+page, lim, search || name);
    }
    findSousSecteurs(secteurId) {
        return this.secteursService.findSousSecteurs(secteurId ? +secteurId : undefined);
    }
    findOne(idOrSlug) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.secteursService.findOne(id);
        }
        return this.secteursService.findBySlug(idOrSlug);
    }
    findSousSecteursBySecteur(idOrSlug) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.secteursService.findSousSecteurs(id);
        }
        return this.secteursService.findSousSecteursBySlug(idOrSlug);
    }
    update(id, data) {
        return this.secteursService.update(id, data);
    }
};
exports.SecteursController = SecteursController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SecteursController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('pagination')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], SecteursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('sous-secteurs'),
    __param(0, (0, common_1.Query)('secteurId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SecteursController.prototype, "findSousSecteurs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SecteursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/sous_secteurs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SecteursController.prototype, "findSousSecteursBySecteur", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SecteursController.prototype, "update", null);
exports.SecteursController = SecteursController = __decorate([
    (0, common_1.Controller)('secteurs'),
    __metadata("design:paramtypes", [secteurs_service_1.SecteursService])
], SecteursController);
//# sourceMappingURL=secteurs.controller.js.map