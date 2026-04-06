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
exports.SuggestionSecteursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SuggestionSecteursService = class SuggestionSecteursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, etat) {
        const skip = (page - 1) * limit;
        const where = {};
        if (etat !== undefined)
            where.etat = etat;
        const [data, total] = await Promise.all([
            this.prisma.suggestion_secteur.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created: 'desc' },
                include: { user: true },
            }),
            this.prisma.suggestion_secteur.count({ where }),
        ]);
        return {
            'hydra:member': data,
            'hydra:totalItems': total,
        };
    }
    async findOne(id) {
        const item = await this.prisma.suggestion_secteur.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!item)
            return null;
        return {
            ...item,
            '@id': `/api/suggestion_secteurs/${item.id}`,
            '@type': 'SuggestionSecteur',
        };
    }
};
exports.SuggestionSecteursService = SuggestionSecteursService;
exports.SuggestionSecteursService = SuggestionSecteursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuggestionSecteursService);
//# sourceMappingURL=suggestion-secteurs.service.js.map