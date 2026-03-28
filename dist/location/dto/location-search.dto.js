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
exports.LocationHeatmapDto = exports.LocationSearchDto = exports.LocationSearchSortOrder = exports.LocationSearchSortBy = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var LocationSearchSortBy;
(function (LocationSearchSortBy) {
    LocationSearchSortBy["DISTANCE"] = "distance";
    LocationSearchSortBy["PRICE"] = "price";
    LocationSearchSortBy["CREATED_AT"] = "createdAt";
    LocationSearchSortBy["UPDATED_AT"] = "updatedAt";
})(LocationSearchSortBy || (exports.LocationSearchSortBy = LocationSearchSortBy = {}));
var LocationSearchSortOrder;
(function (LocationSearchSortOrder) {
    LocationSearchSortOrder["ASC"] = "asc";
    LocationSearchSortOrder["DESC"] = "desc";
})(LocationSearchSortOrder || (exports.LocationSearchSortOrder = LocationSearchSortOrder = {}));
class LocationSearchDto {
    constructor() {
        this.sortBy = LocationSearchSortBy.DISTANCE;
        this.sortOrder = LocationSearchSortOrder.ASC;
        this.page = 1;
        this.limit = 20;
    }
}
exports.LocationSearchDto = LocationSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Center latitude for location-based search',
        example: 40.7128,
        minimum: -90,
        maximum: 90
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], LocationSearchDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Center longitude for location-based search',
        example: -74.0060,
        minimum: -180,
        maximum: 180
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], LocationSearchDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search radius in kilometers',
        example: 10,
        minimum: 0.1,
        maximum: 1000
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], LocationSearchDto.prototype, "radiusKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grid zone ID to filter by',
        example: 'zone-123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationSearchDto.prototype, "gridZoneId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country to filter by',
        example: 'United States'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationSearchDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State/region to filter by',
        example: 'California'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationSearchDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'City to filter by',
        example: 'New York'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationSearchDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum regional price multiplier',
        example: 0.8,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LocationSearchDto.prototype, "minPriceMultiplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum regional price multiplier',
        example: 1.5,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LocationSearchDto.prototype, "maxPriceMultiplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by privacy setting',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LocationSearchDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort results by field',
        enum: LocationSearchSortBy,
        default: LocationSearchSortBy.DISTANCE
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LocationSearchSortBy),
    __metadata("design:type", String)
], LocationSearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: LocationSearchSortOrder,
        default: LocationSearchSortOrder.ASC
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LocationSearchSortOrder),
    __metadata("design:type", String)
], LocationSearchDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
        default: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], LocationSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results per page',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], LocationSearchDto.prototype, "limit", void 0);
class LocationHeatmapDto {
    constructor() {
        this.resolution = 50;
    }
}
exports.LocationHeatmapDto = LocationHeatmapDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bounding box minimum latitude',
        example: 40.0,
        minimum: -90,
        maximum: 90
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], LocationHeatmapDto.prototype, "minLat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bounding box maximum latitude',
        example: 41.0,
        minimum: -90,
        maximum: 90
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], LocationHeatmapDto.prototype, "maxLat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bounding box minimum longitude',
        example: -75.0,
        minimum: -180,
        maximum: 180
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], LocationHeatmapDto.prototype, "minLon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bounding box maximum longitude',
        example: -73.0,
        minimum: -180,
        maximum: 180
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], LocationHeatmapDto.prototype, "maxLon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Heatmap grid resolution (number of cells per side)',
        example: 50,
        minimum: 10,
        maximum: 200,
        default: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], LocationHeatmapDto.prototype, "resolution", void 0);
//# sourceMappingURL=location-search.dto.js.map