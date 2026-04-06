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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactFournisseursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContactFournisseursService = class ContactFournisseursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, search, order) {
        const skip = (page - 1) * limit;
        const where = { del: false };
        if (search) {
            where.contact = { contains: search };
        }
        const orderBy = {};
        if (order && order.created) {
            orderBy.created = order.created;
        }
        else {
            orderBy.created = 'desc';
        }
        const [data, total] = await Promise.all([
            this.prisma.contact_fournisseur.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: true,
                },
                orderBy,
            }),
            this.prisma.contact_fournisseur.count({ where }),
        ]);
        return {
            'hydra:member': data,
            'hydra:totalItems': total,
        };
    }
};
exports.ContactFournisseursService = ContactFournisseursService;
exports.ContactFournisseursService = ContactFournisseursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactFournisseursService);
//# sourceMappingURL=contact-fournisseurs.service.js.map