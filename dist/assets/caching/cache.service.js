"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = CacheService_1 = class CacheService {
    constructor() {
        this.logger = new common_1.Logger(CacheService_1.name);
        this.cache = new Map();
    }
    set(key, value, ttlSeconds = 3600) {
        this.logger.debug(`Setting cache for key: ${key} with TTL: ${ttlSeconds}s`);
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data: value, expiresAt });
    }
    get(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() > cached.expiresAt) {
            this.logger.debug(`Cache expired for key: ${key}`);
            this.cache.delete(key);
            return null;
        }
        this.logger.debug(`Cache hit for key: ${key}`);
        return cached.data;
    }
    invalidate(key) {
        this.logger.debug(`Invalidating cache for key: ${key}`);
        this.cache.delete(key);
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map