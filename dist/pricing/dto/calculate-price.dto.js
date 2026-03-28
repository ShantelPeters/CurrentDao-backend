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
exports.PricePredictionDto = exports.PriceHistoryQueryDto = exports.CalculatePriceDto = exports.EnergyType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var EnergyType;
(function (EnergyType) {
    EnergyType["SOLAR"] = "solar";
    EnergyType["WIND"] = "wind";
    EnergyType["HYDRO"] = "hydro";
    EnergyType["NUCLEAR"] = "nuclear";
    EnergyType["FOSSIL"] = "fossil";
    EnergyType["GEOTHERMAL"] = "geothermal";
})(EnergyType || (exports.EnergyType = EnergyType = {}));
class CalculatePriceDto {
    constructor() {
        this.timestamp = Date.now();
        this.includePrediction = false;
        this.predictionHorizonHours = 1;
    }
}
exports.CalculatePriceDto = CalculatePriceDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "supply", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "demand", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculatePriceDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EnergyType),
    __metadata("design:type", String)
], CalculatePriceDto.prototype, "energyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "basePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], CalculatePriceDto.prototype, "includePrediction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "predictionHorizonHours", void 0);
class PriceHistoryQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.PriceHistoryQueryDto = PriceHistoryQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PriceHistoryQueryDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(EnergyType),
    __metadata("design:type", String)
], PriceHistoryQueryDto.prototype, "energyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PriceHistoryQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PriceHistoryQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PriceHistoryQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PriceHistoryQueryDto.prototype, "limit", void 0);
class PricePredictionDto {
}
exports.PricePredictionDto = PricePredictionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PricePredictionDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EnergyType),
    __metadata("design:type", String)
], PricePredictionDto.prototype, "energyType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], PricePredictionDto.prototype, "hoursAhead", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PricePredictionDto.prototype, "expectedSupply", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PricePredictionDto.prototype, "expectedDemand", void 0);
//# sourceMappingURL=calculate-price.dto.js.map