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
exports.ActualitesController = void 0;
const common_1 = require("@nestjs/common");
const actualites_service_1 = require("./actualites.service");
let ActualitesController = class ActualitesController {
    constructor(actualitesService) {
        this.actualitesService = actualitesService;
    }
    findAll(page = '1', itemsPerPage = '10', limit, search, allQuery) {
        const finalLimit = itemsPerPage || limit || '10';
        let orderBy = { created: 'desc' };
        if (allQuery) {
            const orderBracketKey = Object.keys(allQuery).find(k => k.startsWith('order[') && k.endsWith(']'));
            if (orderBracketKey) {
                const field = orderBracketKey.replace('order[', '').replace(']', '');
                const direction = (allQuery[orderBracketKey] || 'desc').toLowerCase();
                orderBy = { [field]: direction };
            }
            else if (allQuery.order && typeof allQuery.order === 'object') {
                const keys = Object.keys(allQuery.order);
                if (keys.length > 0) {
                    orderBy = { [keys[0]]: allQuery.order[keys[0]] };
                }
            }
        }
        return this.actualitesService.findAll(+page, +finalLimit, search, orderBy);
    }
    findOne(idOrSlug) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.actualitesService.findOne(id);
        }
        return this.actualitesService.findBySlug(idOrSlug);
    }
};
exports.ActualitesController = ActualitesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('itemsPerPage')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, Object]),
    __metadata("design:returntype", void 0)
], ActualitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActualitesController.prototype, "findOne", null);
exports.ActualitesController = ActualitesController = __decorate([
    (0, common_1.Controller)('actualites'),
    __metadata("design:paramtypes", [actualites_service_1.ActualitesService])
], ActualitesController);
//# sourceMappingURL=actualites.controller.js.map