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
exports.PricingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pricing_service_1 = require("./pricing.service");
const calculate_price_dto_1 = require("./dto/calculate-price.dto");
let PricingController = class PricingController {
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    async calculatePrice(calculatePriceDto) {
        return this.pricingService.calculatePrice(calculatePriceDto);
    }
    async predictPrice(predictionDto) {
        return this.pricingService.predictPrice(predictionDto);
    }
    async getPriceHistory(query) {
        return this.pricingService.getPriceHistory(query);
    }
    async getAnalytics(location, energyType) {
        return this.pricingService.getPricingAnalytics(location, energyType);
    }
};
exports.PricingController = PricingController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate energy price based on various factors' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price calculated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_price_dto_1.CalculatePriceDto]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "calculatePrice", null);
__decorate([
    (0, common_1.Post)('predict'),
    (0, swagger_1.ApiOperation)({ summary: 'Predict future energy prices' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price prediction generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_price_dto_1.PricePredictionDto]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "predictPrice", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get price history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price history retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, description: 'Filter by location' }),
    (0, swagger_1.ApiQuery)({ name: 'energyType', required: false, description: 'Filter by energy type' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date timestamp' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date timestamp' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_price_dto_1.PriceHistoryQueryDto]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getPriceHistory", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pricing analytics and statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, description: 'Filter by location' }),
    (0, swagger_1.ApiQuery)({ name: 'energyType', required: false, description: 'Filter by energy type' }),
    __param(0, (0, common_1.Query)('location')),
    __param(1, (0, common_1.Query)('energyType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getAnalytics", null);
exports.PricingController = PricingController = __decorate([
    (0, swagger_1.ApiTags)('pricing'),
    (0, common_1.Controller)('pricing'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService])
], PricingController);
//# sourceMappingURL=pricing.controller.js.map