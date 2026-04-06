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
exports.ReferentielController = void 0;
const common_1 = require("@nestjs/common");
const referentiel_service_1 = require("./referentiel.service");
let ReferentielController = class ReferentielController {
    constructor(referentielService) {
        this.referentielService = referentielService;
    }
    findAllSousSecteurs(page = '1', limit = '100', pagination, name) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllSousSecteurs(+page, lim, name);
    }
    findOneSousSecteur(id) {
        return this.referentielService.findOneSousSecteur(id);
    }
    createSousSecteur(data) {
        const getID = (iri) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };
        const secteur_id = data.secteur ? getID(data.secteur) : null;
        return this.referentielService.createSousSecteur(data.name, secteur_id);
    }
    findAllPays(page = '1', limit = '200', pagination, name) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllPays(+page, lim, name);
    }
    findOnePays(id) {
        return this.referentielService.findOnePays(id);
    }
    findVillesByPays(id) {
        return this.referentielService.findAllVilles(1, 9999, undefined, `/api/pays/${id}`);
    }
    createPays(data) {
        return this.referentielService.createPays(data.name);
    }
    findAllVilles(page = '1', limit = '200', pagination, name, paysIri) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllVilles(+page, lim, name, paysIri);
    }
    findOneVille(id) {
        return this.referentielService.findOneVille(id);
    }
    createVille(data) {
        const getID = (iri) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };
        const pays_id = data.pays ? getID(data.pays) : null;
        return this.referentielService.createVille(data.name, pays_id);
    }
    findAllZoneCommercials(page = '1', limit = '200', pagination, name) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllZoneCommercials(+page, lim, name);
    }
    findAllOffres() {
        return this.referentielService.findAllOffres();
    }
    findAllDurees() {
        return this.referentielService.findAllDurees();
    }
};
exports.ReferentielController = ReferentielController;
__decorate([
    (0, common_1.Get)('sous_secteurs'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('pagination')),
    __param(3, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findAllSousSecteurs", null);
__decorate([
    (0, common_1.Get)('sous_secteurs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findOneSousSecteur", null);
__decorate([
    (0, common_1.Post)('sous_secteurs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "createSousSecteur", null);
__decorate([
    (0, common_1.Get)('pays'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('pagination')),
    __param(3, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findAllPays", null);
__decorate([
    (0, common_1.Get)('pays/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findOnePays", null);
__decorate([
    (0, common_1.Get)('pays/:id/villes'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findVillesByPays", null);
__decorate([
    (0, common_1.Post)('pays'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "createPays", null);
__decorate([
    (0, common_1.Get)('villes'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('pagination')),
    __param(3, (0, common_1.Query)('name')),
    __param(4, (0, common_1.Query)('pays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findAllVilles", null);
__decorate([
    (0, common_1.Get)('villes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findOneVille", null);
__decorate([
    (0, common_1.Post)('villes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "createVille", null);
__decorate([
    (0, common_1.Get)('zone_commercials'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('pagination')),
    __param(3, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findAllZoneCommercials", null);
__decorate([
    (0, common_1.Get)('offres'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findAllOffres", null);
__decorate([
    (0, common_1.Get)('durees'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferentielController.prototype, "findAllDurees", null);
exports.ReferentielController = ReferentielController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [referentiel_service_1.ReferentielService])
], ReferentielController);
//# sourceMappingURL=referentiel.controller.js.map