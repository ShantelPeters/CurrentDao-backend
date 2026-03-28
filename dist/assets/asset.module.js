"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetModule = void 0;
const common_1 = require("@nestjs/common");
const cdn_service_1 = require("./cdn/cdn.service");
const compression_service_1 = require("./optimization/compression.service");
const image_optimizer_service_1 = require("./optimization/image-optimizer.service");
const cache_service_1 = require("./caching/cache.service");
const asset_version_service_1 = require("./versioning/asset-version.service");
let AssetModule = class AssetModule {
};
exports.AssetModule = AssetModule;
exports.AssetModule = AssetModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            cdn_service_1.CdnService,
            compression_service_1.CompressionService,
            image_optimizer_service_1.ImageOptimizerService,
            cache_service_1.CacheService,
            asset_version_service_1.AssetVersionService,
        ],
        exports: [
            cdn_service_1.CdnService,
            compression_service_1.CompressionService,
            image_optimizer_service_1.ImageOptimizerService,
            cache_service_1.CacheService,
            asset_version_service_1.AssetVersionService,
        ],
    })
], AssetModule);
//# sourceMappingURL=asset.module.js.map