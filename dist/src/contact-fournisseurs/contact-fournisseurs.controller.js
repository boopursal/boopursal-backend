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
exports.ContactFournisseursController = void 0;
const common_1 = require("@nestjs/common");
const contact_fournisseurs_service_1 = require("./contact-fournisseurs.service");
let ContactFournisseursController = class ContactFournisseursController {
    constructor(contactFournisseursService) {
        this.contactFournisseursService = contactFournisseursService;
    }
    findAll(page = '1', limit = '20', search, order) {
        return this.contactFournisseursService.findAll(+page, +limit, search, order);
    }
};
exports.ContactFournisseursController = ContactFournisseursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", void 0)
], ContactFournisseursController.prototype, "findAll", null);
exports.ContactFournisseursController = ContactFournisseursController = __decorate([
    (0, common_1.Controller)('contact_fournisseurs'),
    __metadata("design:paramtypes", [contact_fournisseurs_service_1.ContactFournisseursService])
], ContactFournisseursController);
//# sourceMappingURL=contact-fournisseurs.controller.js.map