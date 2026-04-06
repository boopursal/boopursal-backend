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
exports.DemandeDevisController = void 0;
const common_1 = require("@nestjs/common");
const demande_devis_service_1 = require("./demande-devis.service");
let DemandeDevisController = class DemandeDevisController {
    constructor(demandeDevisService) {
        this.demandeDevisService = demandeDevisService;
    }
    findAll(page = '1', limit = '20', del, statut, type) {
        let sStatut = undefined;
        if (statut === 'false')
            sStatut = false;
        if (statut === 'true')
            sStatut = true;
        return this.demandeDevisService.findAll(+page, +limit, del ? +del : undefined, sStatut, type);
    }
    findOne(id) {
        return this.demandeDevisService.findOne(id);
    }
};
exports.DemandeDevisController = DemandeDevisController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('del')),
    __param(3, (0, common_1.Query)('statut')),
    __param(4, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], DemandeDevisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DemandeDevisController.prototype, "findOne", null);
exports.DemandeDevisController = DemandeDevisController = __decorate([
    (0, common_1.Controller)('demande_devis'),
    __metadata("design:paramtypes", [demande_devis_service_1.DemandeDevisService])
], DemandeDevisController);
//# sourceMappingURL=demande-devis.controller.js.map