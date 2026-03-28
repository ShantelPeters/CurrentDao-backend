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
exports.TradingVolumeReport = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_data_entity_1 = require("../entities/analytics-data.entity");
let TradingVolumeReport = class TradingVolumeReport {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    async generateReport(params) {
        const startDate = params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = params.endDate || new Date();
        const period = params.period || analytics_data_entity_1.AggregationPeriod.DAILY;
        const volumeData = await this.fetchTradingVolumeData(startDate, endDate, period, params);
        const summary = this.calculateSummary(volumeData);
        const geographicBreakdown = params.includeComparativeAnalysis
            ? await this.getGeographicBreakdown(startDate, endDate, params)
            : undefined;
        const renewableEnergyBreakdown = await this.getRenewableEnergyBreakdown(startDate, endDate, params);
        return {
            period: {
                start: startDate,
                end: endDate,
                aggregation: period
            },
            summary,
            data: volumeData,
            geographicBreakdown,
            renewableEnergyBreakdown
        };
    }
    async fetchTradingVolumeData(startDate, endDate, period, params) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.TRADING_VOLUME })
            .andWhere('analytics.period = :period', { period })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        });
        if (params.userId) {
            queryBuilder.andWhere('analytics.userId = :userId', { userId: params.userId });
        }
        if (params.gridZoneId) {
            queryBuilder.andWhere('analytics.gridZoneId = :gridZoneId', { gridZoneId: params.gridZoneId });
        }
        if (params.country) {
            queryBuilder.andWhere('analytics.country = :country', { country: params.country });
        }
        queryBuilder.orderBy('analytics.timestamp', 'ASC');
        const analyticsData = await queryBuilder.getMany();
        return analyticsData.map(data => ({
            timestamp: data.timestamp,
            volume: data.count || 0,
            value: parseFloat(data.totalValue?.toString() || '0'),
            transactions: data.count || 0,
            averageTransactionSize: parseFloat(data.averageValue?.toString() || '0'),
            period: data.period
        }));
    }
    calculateSummary(data) {
        if (data.length === 0) {
            return {
                totalVolume: 0,
                totalValue: 0,
                totalTransactions: 0,
                averageTransactionSize: 0,
                peakVolume: 0,
                peakVolumeTime: new Date(),
                growthRate: 0
            };
        }
        const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        const totalTransactions = data.reduce((sum, item) => sum + item.transactions, 0);
        const averageTransactionSize = totalTransactions > 0 ? totalValue / totalTransactions : 0;
        const peakData = data.reduce((max, item) => item.volume > max.volume ? item : max, data[0]);
        const growthRate = data.length > 1
            ? ((data[data.length - 1].volume - data[0].volume) / data[0].volume) * 100
            : 0;
        return {
            totalVolume,
            totalValue,
            totalTransactions,
            averageTransactionSize,
            peakVolume: peakData.volume,
            peakVolumeTime: peakData.timestamp,
            growthRate
        };
    }
    async getGeographicBreakdown(startDate, endDate, params) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('analytics.country', 'country')
            .addSelect('SUM(analytics.count)', 'volume')
            .addSelect('SUM(analytics.totalValue)', 'value')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.TRADING_VOLUME })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .andWhere('analytics.country IS NOT NULL')
            .groupBy('analytics.country')
            .orderBy('SUM(analytics.count)', 'DESC');
        if (params.userId) {
            queryBuilder.andWhere('analytics.userId = :userId', { userId: params.userId });
        }
        const results = await queryBuilder.getRawMany();
        const totalVolume = results.reduce((sum, item) => sum + parseFloat(item.volume || '0'), 0);
        return results.map(item => ({
            country: item.country,
            volume: parseFloat(item.volume || '0'),
            value: parseFloat(item.value || '0'),
            percentage: totalVolume > 0 ? (parseFloat(item.volume || '0') / totalVolume) * 100 : 0
        }));
    }
    async getRenewableEnergyBreakdown(startDate, endDate, params) {
        const totalVolumeQuery = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('SUM(analytics.count)', 'totalVolume')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.TRADING_VOLUME })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        });
        if (params.userId) {
            totalVolumeQuery.andWhere('analytics.userId = :userId', { userId: params.userId });
        }
        const totalVolumeResult = await totalVolumeQuery.getRawOne();
        const totalVolume = parseFloat(totalVolumeResult?.totalVolume || '0');
        const renewableVolumeQuery = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('SUM(analytics.count)', 'renewableVolume')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.RENEWABLE_ENERGY })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        });
        if (params.userId) {
            renewableVolumeQuery.andWhere('analytics.userId = :userId', { userId: params.userId });
        }
        const renewableVolumeResult = await renewableVolumeQuery.getRawOne();
        const renewableVolume = parseFloat(renewableVolumeResult?.renewableVolume || '0');
        return {
            renewableVolume,
            totalVolume,
            percentage: totalVolume > 0 ? (renewableVolume / totalVolume) * 100 : 0
        };
    }
    async generateHourlyReport(params) {
        return this.generateReport({
            ...params,
            period: analytics_data_entity_1.AggregationPeriod.HOURLY
        });
    }
    async generateDailyReport(params) {
        return this.generateReport({
            ...params,
            period: analytics_data_entity_1.AggregationPeriod.DAILY
        });
    }
    async generateWeeklyReport(params) {
        return this.generateReport({
            ...params,
            period: analytics_data_entity_1.AggregationPeriod.WEEKLY
        });
    }
    async generateMonthlyReport(params) {
        return this.generateReport({
            ...params,
            period: analytics_data_entity_1.AggregationPeriod.MONTHLY
        });
    }
};
exports.TradingVolumeReport = TradingVolumeReport;
exports.TradingVolumeReport = TradingVolumeReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_data_entity_1.AnalyticsData)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TradingVolumeReport);
//# sourceMappingURL=trading-volume.report.js.map