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
var PricingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const price_history_entity_1 = require("./entities/price-history.entity");
const calculate_price_dto_1 = require("./dto/calculate-price.dto");
const dynamic_pricing_algorithm_1 = require("./algorithms/dynamic-pricing.algorithm");
const location_adjustment_algorithm_1 = require("./algorithms/location-adjustment.algorithm");
const time_pricing_algorithm_1 = require("./algorithms/time-pricing.algorithm");
const prediction_algorithm_1 = require("./algorithms/prediction.algorithm");
let PricingService = PricingService_1 = class PricingService {
    constructor(priceHistoryRepository, dynamicPricingAlgorithm, locationAdjustmentAlgorithm, timePricingAlgorithm, predictionAlgorithm) {
        this.priceHistoryRepository = priceHistoryRepository;
        this.dynamicPricingAlgorithm = dynamicPricingAlgorithm;
        this.locationAdjustmentAlgorithm = locationAdjustmentAlgorithm;
        this.timePricingAlgorithm = timePricingAlgorithm;
        this.predictionAlgorithm = predictionAlgorithm;
        this.logger = new common_1.Logger(PricingService_1.name);
    }
    async calculatePrice(calculatePriceDto) {
        const { supply, demand, location, energyType, timestamp = Date.now(), basePrice, includePrediction = false, predictionHorizonHours = 1 } = calculatePriceDto;
        const supplyDemandRatio = supply / demand;
        const calculatedBasePrice = this.dynamicPricingAlgorithm.calculateBasePrice(supply, demand, basePrice);
        const locationMultiplier = this.locationAdjustmentAlgorithm.calculateLocationMultiplier(location);
        const timeMultiplier = this.timePricingAlgorithm.calculateTimeMultiplier(timestamp);
        const renewablePremium = this.calculateRenewablePremium(energyType);
        const isPeakHour = this.timePricingAlgorithm.isPeakHour(timestamp);
        let finalPrice = calculatedBasePrice * locationMultiplier * timeMultiplier;
        if (this.isRenewableEnergy(energyType)) {
            finalPrice *= (1 + renewablePremium);
        }
        finalPrice = this.dynamicPricingAlgorithm.applyPriceBounds(finalPrice);
        const result = {
            basePrice: Math.round(calculatedBasePrice * 100) / 100,
            finalPrice: Math.round(finalPrice * 100) / 100,
            locationMultiplier: Math.round(locationMultiplier * 100) / 100,
            timeMultiplier: Math.round(timeMultiplier * 100) / 100,
            renewablePremium: Math.round(renewablePremium * 100) / 100,
            supplyDemandRatio: Math.round(supplyDemandRatio * 100) / 100,
            isPeakHour,
        };
        if (includePrediction) {
            const historicalData = await this.getHistoricalData(location, energyType, 168);
            const prediction = this.predictionAlgorithm.predictPrice(historicalData, predictionHorizonHours, supply, demand);
            result.predictedPrice = Math.round(prediction.predictedPrice * 100) / 100;
            result.predictionAccuracy = Math.round(prediction.confidence * 100);
        }
        await this.savePriceHistory({
            basePrice: calculatedBasePrice,
            finalPrice,
            location,
            energyType,
            supply,
            demand,
            supplyDemandRatio,
            locationMultiplier,
            timeMultiplier,
            renewablePremium,
            predictedPrice: result.predictedPrice,
            predictionAccuracy: result.predictionAccuracy,
            isPeakHour,
            isRenewable: this.isRenewableEnergy(energyType),
            timestamp: new Date(timestamp),
        });
        return result;
    }
    calculateRenewablePremium(energyType) {
        const premiums = {
            [calculate_price_dto_1.EnergyType.SOLAR]: 0.05,
            [calculate_price_dto_1.EnergyType.WIND]: 0.08,
            [calculate_price_dto_1.EnergyType.HYDRO]: 0.03,
            [calculate_price_dto_1.EnergyType.NUCLEAR]: -0.02,
            [calculate_price_dto_1.EnergyType.FOSSIL]: 0.15,
            [calculate_price_dto_1.EnergyType.GEOTHERMAL]: 0.04,
        };
        return premiums[energyType] || 0;
    }
    isRenewableEnergy(energyType) {
        return [calculate_price_dto_1.EnergyType.SOLAR, calculate_price_dto_1.EnergyType.WIND, calculate_price_dto_1.EnergyType.HYDRO, calculate_price_dto_1.EnergyType.GEOTHERMAL].includes(energyType);
    }
    async predictPrice(predictionDto) {
        const { location, energyType, hoursAhead, expectedSupply, expectedDemand } = predictionDto;
        const historicalData = await this.getHistoricalData(location, energyType, 168);
        const prediction = this.predictionAlgorithm.predictPrice(historicalData, hoursAhead, expectedSupply, expectedDemand);
        return {
            predictedPrice: Math.round(prediction.predictedPrice * 100) / 100,
            confidence: Math.round(prediction.confidence * 100) / 100,
            factors: prediction.factors,
        };
    }
    async getPriceHistory(query) {
        const { location, energyType, startDate, endDate, page = 1, limit = 10 } = query;
        const whereClause = {};
        if (location)
            whereClause.location = location;
        if (energyType)
            whereClause.energyType = energyType;
        if (startDate)
            whereClause.timestamp = { $gte: new Date(startDate) };
        if (endDate)
            whereClause.timestamp = { $lte: new Date(endDate) };
        const [history, total] = await this.priceHistoryRepository.findAndCount({
            where: whereClause,
            order: { timestamp: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const prices = history.map(h => h.finalPrice);
        const averagePrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        return {
            history,
            total,
            averagePrice: Math.round(averagePrice * 100) / 100,
            minPrice: Math.round(minPrice * 100) / 100,
            maxPrice: Math.round(maxPrice * 100) / 100,
        };
    }
    async getHistoricalData(location, energyType, hours) {
        const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
        return this.priceHistoryRepository.find({
            where: {
                location,
                energyType,
                timestamp: (0, typeorm_2.LessThan)(new Date()),
            },
            order: { timestamp: 'DESC' },
            take: 100,
        });
    }
    async savePriceHistory(priceData) {
        const priceHistory = this.priceHistoryRepository.create(priceData);
        await this.priceHistoryRepository.save(priceHistory);
    }
    async getPricingAnalytics(location, energyType) {
        const whereClause = {};
        if (location)
            whereClause.location = location;
        if (energyType)
            whereClause.energyType = energyType;
        const history = await this.priceHistoryRepository.find({
            where: whereClause,
            order: { timestamp: 'DESC' },
            take: 1000,
        });
        if (history.length === 0) {
            return {
                totalTransactions: 0,
                averagePrice: 0,
                priceVolatility: 0,
                peakHourAverage: 0,
                offPeakHourAverage: 0,
                renewablePremium: 0,
                predictionAccuracy: 0,
            };
        }
        const prices = history.map(h => h.finalPrice);
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - averagePrice, 2), 0) / prices.length;
        const priceVolatility = Math.sqrt(variance);
        const peakHourPrices = history.filter(h => h.isPeakHour).map(h => h.finalPrice);
        const offPeakHourPrices = history.filter(h => !h.isPeakHour).map(h => h.finalPrice);
        const peakHourAverage = peakHourPrices.length > 0
            ? peakHourPrices.reduce((sum, price) => sum + price, 0) / peakHourPrices.length
            : 0;
        const offPeakHourAverage = offPeakHourPrices.length > 0
            ? offPeakHourPrices.reduce((sum, price) => sum + price, 0) / offPeakHourPrices.length
            : 0;
        const renewablePrices = history.filter(h => h.isRenewable).map(h => h.finalPrice);
        const nonRenewablePrices = history.filter(h => !h.isRenewable).map(h => h.finalPrice);
        const renewableAverage = renewablePrices.length > 0
            ? renewablePrices.reduce((sum, price) => sum + price, 0) / renewablePrices.length
            : 0;
        const nonRenewableAverage = nonRenewablePrices.length > 0
            ? nonRenewablePrices.reduce((sum, price) => sum + price, 0) / nonRenewablePrices.length
            : 0;
        const renewablePremium = nonRenewableAverage > 0 ? (renewableAverage - nonRenewableAverage) / nonRenewableAverage : 0;
        const predictionsWithAccuracy = history.filter(h => h.predictionAccuracy !== null);
        const predictionAccuracy = predictionsWithAccuracy.length > 0
            ? predictionsWithAccuracy.reduce((sum, h) => sum + h.predictionAccuracy, 0) / predictionsWithAccuracy.length
            : 0;
        return {
            totalTransactions: history.length,
            averagePrice: Math.round(averagePrice * 100) / 100,
            priceVolatility: Math.round(priceVolatility * 100) / 100,
            peakHourAverage: Math.round(peakHourAverage * 100) / 100,
            offPeakHourAverage: Math.round(offPeakHourAverage * 100) / 100,
            renewablePremium: Math.round(renewablePremium * 100) / 100,
            predictionAccuracy: Math.round(predictionAccuracy * 100) / 100,
        };
    }
    async cleanupOldData() {
        const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const result = await this.priceHistoryRepository.delete({
            timestamp: (0, typeorm_2.LessThan)(cutoffDate),
        });
        this.logger.log(`Cleaned up ${result.affected} old price records`);
    }
};
exports.PricingService = PricingService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingService.prototype, "cleanupOldData", null);
exports.PricingService = PricingService = PricingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(price_history_entity_1.PriceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        dynamic_pricing_algorithm_1.DynamicPricingAlgorithm,
        location_adjustment_algorithm_1.LocationAdjustmentAlgorithm,
        time_pricing_algorithm_1.TimePricingAlgorithm,
        prediction_algorithm_1.PredictionAlgorithm])
], PricingService);
//# sourceMappingURL=pricing.service.js.map