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
exports.PortalController = void 0;
const common_1 = require("@nestjs/common");
const portal_service_1 = require("./portal.service");
let PortalController = class PortalController {
    constructor(portalService) {
        this.portalService = portalService;
    }
    getFocusCategories() {
        return this.portalService.getFocusCategories();
    }
    getParcourirSecteurs() {
        return this.portalService.getParcourirSecteurs();
    }
    getSelectProduits() {
        return this.portalService.getSelectProduits();
    }
    getParcourirActivites(idOrSlug) {
        return this.portalService.getParcourirActivites(idOrSlug);
    }
    getParcourirCategories(idOrSlug) {
        return this.portalService.getParcourirCategories(idOrSlug);
    }
    countDemandesCategorie(secteur, sousSecteur, categorie) {
        return this.portalService.countDemandesCategorie(secteur, sousSecteur, categorie);
    }
    countDemandesPays() {
        return this.portalService.countDemandesPays();
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, common_1.Get)('focus_categories_mobile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getFocusCategories", null);
__decorate([
    (0, common_1.Get)('parcourir_secteurs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getParcourirSecteurs", null);
__decorate([
    (0, common_1.Get)('select_produits'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getSelectProduits", null);
__decorate([
    (0, common_1.Get)('parcourir_activites/:idOrSlug'),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getParcourirActivites", null);
__decorate([
    (0, common_1.Get)('parcourir_categories/:idOrSlug'),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getParcourirCategories", null);
__decorate([
    (0, common_1.Get)('count_demandes_achats_categorie'),
    __param(0, (0, common_1.Query)('secteur')),
    __param(1, (0, common_1.Query)('sousSecteur')),
    __param(2, (0, common_1.Query)('categorie')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "countDemandesCategorie", null);
__decorate([
    (0, common_1.Get)('count_demandes_achats_pays'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "countDemandesPays", null);
exports.PortalController = PortalController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [portal_service_1.PortalService])
], PortalController);
//# sourceMappingURL=portal.controller.js.map