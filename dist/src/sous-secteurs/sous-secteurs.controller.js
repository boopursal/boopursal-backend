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
exports.SousSecteursController = void 0;
const common_1 = require("@nestjs/common");
const sous_secteurs_service_1 = require("./sous-secteurs.service");
let SousSecteursController = class SousSecteursController {
    constructor(sousSecteursService) {
        this.sousSecteursService = sousSecteursService;
    }
    findAll(secteurId, secteurIdAlt, search) {
        const sid = secteurId || secteurIdAlt;
        return this.sousSecteursService.findAll(sid ? +sid : undefined, search);
    }
    findOne(idOrSlug) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.sousSecteursService.findOne(id);
        }
        return this.sousSecteursService.findBySlug(idOrSlug);
    }
    create(data) {
        return this.sousSecteursService.create(data);
    }
    update(id, data) {
        return this.sousSecteursService.update(id, data);
    }
};
exports.SousSecteursController = SousSecteursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('secteurId')),
    __param(1, (0, common_1.Query)('secteur.id')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SousSecteursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SousSecteursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SousSecteursController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SousSecteursController.prototype, "update", null);
exports.SousSecteursController = SousSecteursController = __decorate([
    (0, common_1.Controller)('sous_secteurs'),
    __metadata("design:paramtypes", [sous_secteurs_service_1.SousSecteursService])
], SousSecteursController);
//# sourceMappingURL=sous-secteurs.controller.js.map