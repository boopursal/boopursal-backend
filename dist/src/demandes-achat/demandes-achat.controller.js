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
exports.DemandesAchatController = void 0;
const common_1 = require("@nestjs/common");
const demandes_achat_service_1 = require("./demandes-achat.service");
let DemandesAchatController = class DemandesAchatController {
    constructor(demandesAchatService) {
        this.demandesAchatService = demandesAchatService;
    }
    findAll(query) {
        return this.demandesAchatService.findAll(query);
    }
    getStats() {
        return this.demandesAchatService.getStats();
    }
    findOne(idOrSlug) {
        return this.demandesAchatService.findOne(idOrSlug);
    }
    findFournisseur(idOrSlug) {
        return this.demandesAchatService.findFournisseur(idOrSlug);
    }
    findVisites(idOrSlug) {
        return this.demandesAchatService.findVisites(idOrSlug);
    }
};
exports.DemandesAchatController = DemandesAchatController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DemandesAchatController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DemandesAchatController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':idOrSlug'),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DemandesAchatController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':idOrSlug/fournisseur'),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DemandesAchatController.prototype, "findFournisseur", null);
__decorate([
    (0, common_1.Get)(':idOrSlug/visites'),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DemandesAchatController.prototype, "findVisites", null);
exports.DemandesAchatController = DemandesAchatController = __decorate([
    (0, common_1.Controller)('demande_achats'),
    __metadata("design:paramtypes", [demandes_achat_service_1.DemandesAchatService])
], DemandesAchatController);
//# sourceMappingURL=demandes-achat.controller.js.map