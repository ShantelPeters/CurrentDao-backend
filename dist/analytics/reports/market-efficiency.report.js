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
exports.MarketEfficiencyReport = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_data_entity_1 = require("../entities/analytics-data.entity");
let MarketEfficiencyReport = class MarketEfficiencyReport {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    async generateReport(params) {
        const startDate = params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = params.endDate || new Date();
        const period = params.period || analytics_data_entity_1.AggregationPeriod.DAILY;
        const metrics = await this.fetchMarketEfficiencyData(startDate, endDate, period, params);
        const summary = this.calculateSummary(metrics);
        const geographicComparison = params.includeComparativeAnalysis
            ? await this.getGeographicComparison(startDate, endDate, params)
            : undefined;
        const timeAnalysis = await this.getTimeBasedAnalysis(startDate, endDate, params);
        const recommendations = this.generateRecommendations(summary);
        return {
            period: {
                start: startDate,
                end: endDate,
                aggregation: period
            },
            summary,
            metrics,
            geographicComparison,
            timeAnalysis,
            recommendations
        };
    }
    async fetchMarketEfficiencyData(startDate, endDate, period, params) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.MARKET_EFFICIENCY })
            .andWhere('analytics.period = :period', { period })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        });
        if (params.gridZoneId) {
            queryBuilder.andWhere('analytics.gridZoneId = :gridZoneId', { gridZoneId: params.gridZoneId });
        }
        if (params.country) {
            queryBuilder.andWhere('analytics.country = :country', { country: params.country });
        }
        queryBuilder.orderBy('analytics.timestamp', 'ASC');
        const analyticsData = await queryBuilder.getMany();
        return analyticsData.map(data => {
            const efficiencyData = data.data;
            return {
                timestamp: data.timestamp,
                bidAskSpread: parseFloat(efficiencyData.bidAskSpread || '0'),
                spreadPercent: parseFloat(efficiencyData.spreadPercent || '0'),
                volatility: parseFloat(efficiencyData.volatility || '0'),
                liquidity: parseFloat(efficiencyData.liquidity || '0'),
                marketDepth: parseFloat(efficiencyData.marketDepth || '0'),
                priceEfficiency: parseFloat(efficiencyData.priceEfficiency || '0'),
                volumeWeightedAveragePrice: parseFloat(efficiencyData.vwap || '0'),
                tradingVelocity: parseFloat(efficiencyData.tradingVelocity || '0'),
                orderBookImbalance: parseFloat(efficiencyData.orderBookImbalance || '0')
            };
        });
    }
    calculateSummary(metrics) {
        if (metrics.length === 0) {
            return {
                averageSpread: 0,
                averageVolatility: 0,
                averageLiquidity: 0,
                marketEfficiencyScore: 0,
                priceDiscoveryEfficiency: 0,
                informationAsymmetry: 0
            };
        }
        const averageSpread = metrics.reduce((sum, m) => sum + m.bidAskSpread, 0) / metrics.length;
        const averageVolatility = metrics.reduce((sum, m) => sum + m.volatility, 0) / metrics.length;
        const averageLiquidity = metrics.reduce((sum, m) => sum + m.liquidity, 0) / metrics.length;
        const averagePriceEfficiency = metrics.reduce((sum, m) => sum + m.priceEfficiency, 0) / metrics.length;
        const spreadScore = Math.max(0, 100 - (averageSpread * 1000));
        const volatilityScore = Math.max(0, 100 - (averageVolatility * 100));
        const liquidityScore = Math.min(100, averageLiquidity * 10);
        const priceEfficiencyScore = averagePriceEfficiency * 100;
        const marketEfficiencyScore = (spreadScore + volatilityScore + liquidityScore + priceEfficiencyScore) / 4;
        const priceDiscoveryEfficiency = this.calculatePriceDiscoveryEfficiency(metrics);
        const informationAsymmetry = Math.max(0, 100 - priceDiscoveryEfficiency);
        return {
            averageSpread,
            averageVolatility,
            averageLiquidity,
            marketEfficiencyScore,
            priceDiscoveryEfficiency,
            informationAsymmetry
        };
    }
    calculatePriceDiscoveryEfficiency(metrics) {
        if (metrics.length < 2)
            return 0;
        let totalEfficiency = 0;
        for (let i = 1; i < metrics.length; i++) {
            const currentEfficiency = metrics[i].priceEfficiency;
            const previousEfficiency = metrics[i - 1].priceEfficiency;
            const convergenceRate = Math.abs(currentEfficiency - previousEfficiency);
            totalEfficiency += Math.max(0, 1 - convergenceRate);
        }
        return (totalEfficiency / (metrics.length - 1)) * 100;
    }
    async getGeographicComparison(startDate, endDate, params) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('analytics.country', 'country')
            .addSelect('AVG(analytics.data->>\'bidAskSpread\')', 'spread')
            .addSelect('AVG(analytics.data->>\'volatility\')', 'volatility')
            .addSelect('AVG(analytics.data->>\'liquidity\')', 'liquidity')
            .addSelect('AVG(analytics.data->>\'priceEfficiency\')', 'priceEfficiency')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.MARKET_EFFICIENCY })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .andWhere('analytics.country IS NOT NULL')
            .groupBy('analytics.country');
        if (params.gridZoneId) {
            queryBuilder.andWhere('analytics.gridZoneId = :gridZoneId', { gridZoneId: params.gridZoneId });
        }
        const results = await queryBuilder.getRawMany();
        return results.map(result => {
            const spread = parseFloat(result.spread || '0');
            const volatility = parseFloat(result.volatility || '0');
            const liquidity = parseFloat(result.liquidity || '0');
            const priceEfficiency = parseFloat(result.priceEfficiency || '0');
            const spreadScore = Math.max(0, 100 - (spread * 1000));
            const volatilityScore = Math.max(0, 100 - (volatility * 100));
            const liquidityScore = Math.min(100, liquidity * 10);
            const priceEfficiencyScore = priceEfficiency * 100;
            const efficiencyScore = (spreadScore + volatilityScore + liquidityScore + priceEfficiencyScore) / 4;
            return {
                country: result.country,
                efficiencyScore,
                spread,
                volatility,
                liquidity
            };
        });
    }
    async getTimeBasedAnalysis(startDate, endDate, params) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('EXTRACT(HOUR FROM analytics.timestamp)', 'hour')
            .addSelect('AVG(analytics.data->>\'priceEfficiency\')', 'efficiencyScore')
            .addSelect('AVG(analytics.data->>\'volatility\')', 'volatility')
            .addSelect('SUM(analytics.count)', 'volume')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.MARKET_EFFICIENCY })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .groupBy('EXTRACT(HOUR FROM analytics.timestamp)')
            .orderBy('hour', 'ASC');
        if (params.gridZoneId) {
            queryBuilder.andWhere('analytics.gridZoneId = :gridZoneId', { gridZoneId: params.gridZoneId });
        }
        if (params.country) {
            queryBuilder.andWhere('analytics.country = :country', { country: params.country });
        }
        const results = await queryBuilder.getRawMany();
        return results.map(result => ({
            hour: parseInt(result.hour),
            efficiencyScore: parseFloat(result.efficiencyScore || '0') * 100,
            volume: parseInt(result.volume || '0'),
            volatility: parseFloat(result.volatility || '0')
        }));
    }
    generateRecommendations(summary) {
        const recommendations = [];
        if (summary.averageSpread > 0.05) {
            recommendations.push('High bid-ask spread detected. Consider improving market maker incentives to reduce spreads.');
        }
        if (summary.averageVolatility > 0.3) {
            recommendations.push('High volatility observed. Implement circuit breakers or volatility controls to stabilize the market.');
        }
        if (summary.averageLiquidity < 5) {
            recommendations.push('Low liquidity detected. Consider liquidity provision programs or market maker incentives.');
        }
        if (summary.marketEfficiencyScore < 60) {
            recommendations.push('Market efficiency is below optimal levels. Review market structure and consider regulatory improvements.');
        }
        if (summary.priceDiscoveryEfficiency < 50) {
            recommendations.push('Price discovery is inefficient. Improve information dissemination and transparency requirements.');
        }
        if (summary.informationAsymmetry > 40) {
            recommendations.push('High information asymmetry detected. Implement better disclosure requirements and real-time data feeds.');
        }
        if (recommendations.length === 0) {
            recommendations.push('Market efficiency metrics are within acceptable ranges. Continue monitoring for improvements.');
        }
        return recommendations;
    }
    async generateRealTimeMetrics(gridZoneId, country) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.MARKET_EFFICIENCY })
            .andWhere('analytics.period = :period', { period: analytics_data_entity_1.AggregationPeriod.HOURLY })
            .orderBy('analytics.timestamp', 'DESC')
            .limit(1);
        if (gridZoneId) {
            queryBuilder.andWhere('analytics.gridZoneId = :gridZoneId', { gridZoneId });
        }
        if (country) {
            queryBuilder.andWhere('analytics.country = :country', { country });
        }
        const latestData = await queryBuilder.getOne();
        if (!latestData) {
            const now = new Date();
            return {
                timestamp: now,
                bidAskSpread: 0.02,
                spreadPercent: 2.0,
                volatility: 0.15,
                liquidity: 7.5,
                marketDepth: 1000,
                priceEfficiency: 0.85,
                volumeWeightedAveragePrice: 50,
                tradingVelocity: 5.2,
                orderBookImbalance: 0.1
            };
        }
        const efficiencyData = latestData.data;
        return {
            timestamp: latestData.timestamp,
            bidAskSpread: parseFloat(efficiencyData.bidAskSpread || '0'),
            spreadPercent: parseFloat(efficiencyData.spreadPercent || '0'),
            volatility: parseFloat(efficiencyData.volatility || '0'),
            liquidity: parseFloat(efficiencyData.liquidity || '0'),
            marketDepth: parseFloat(efficiencyData.marketDepth || '0'),
            priceEfficiency: parseFloat(efficiencyData.priceEfficiency || '0'),
            volumeWeightedAveragePrice: parseFloat(efficiencyData.vwap || '0'),
            tradingVelocity: parseFloat(efficiencyData.tradingVelocity || '0'),
            orderBookImbalance: parseFloat(efficiencyData.orderBookImbalance || '0')
        };
    }
};
exports.MarketEfficiencyReport = MarketEfficiencyReport;
exports.MarketEfficiencyReport = MarketEfficiencyReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_data_entity_1.AnalyticsData)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MarketEfficiencyReport);
//# sourceMappingURL=market-efficiency.report.js.map