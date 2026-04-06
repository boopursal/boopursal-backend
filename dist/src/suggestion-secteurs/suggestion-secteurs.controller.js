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
exports.SuggestionSecteursController = void 0;
const common_1 = require("@nestjs/common");
const suggestion_secteurs_service_1 = require("./suggestion-secteurs.service");
let SuggestionSecteursController = class SuggestionSecteursController {
    constructor(suggestionSecteursService) {
        this.suggestionSecteursService = suggestionSecteursService;
    }
    findAll(page = '1', limit = '20', etat) {
        return this.suggestionSecteursService.findAll(+page, +limit, etat === 'true' ? true : (etat === 'false' ? false : undefined));
    }
    findOne(id) {
        return this.suggestionSecteursService.findOne(+id);
    }
};
exports.SuggestionSecteursController = SuggestionSecteursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('etat')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], SuggestionSecteursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuggestionSecteursController.prototype, "findOne", null);
exports.SuggestionSecteursController = SuggestionSecteursController = __decorate([
    (0, common_1.Controller)('suggestion_secteurs'),
    __metadata("design:paramtypes", [suggestion_secteurs_service_1.SuggestionSecteursService])
], SuggestionSecteursController);
//# sourceMappingURL=suggestion-secteurs.controller.js.map