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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_data_entity_1 = require("./entities/analytics-data.entity");
const trading_volume_report_1 = require("./reports/trading-volume.report");
const price_trends_report_1 = require("./reports/price-trends.report");
const user_performance_report_1 = require("./reports/user-performance.report");
const market_efficiency_report_1 = require("./reports/market-efficiency.report");
let AnalyticsService = class AnalyticsService {
    constructor(analyticsRepository, tradingVolumeReport, priceTrendsReport, userPerformanceReport, marketEfficiencyReport) {
        this.analyticsRepository = analyticsRepository;
        this.tradingVolumeReport = tradingVolumeReport;
        this.priceTrendsReport = priceTrendsReport;
        this.userPerformanceReport = userPerformanceReport;
        this.marketEfficiencyReport = marketEfficiencyReport;
    }
    async generateTradingVolumeReport(params) {
        return this.tradingVolumeReport.generateReport(params);
    }
    async generatePriceTrendsReport(params) {
        return this.priceTrendsReport.generateReport(params);
    }
    async generateUserPerformanceReport(params) {
        return this.userPerformanceReport.generateReport(params);
    }
    async generateMarketEfficiencyReport(params) {
        return this.marketEfficiencyReport.generateReport(params);
    }
    async getDashboardMetrics(params) {
        const timeWindow = params.timeWindowHours || 24;
        const startDate = new Date(Date.now() - timeWindow * 60 * 60 * 1000);
        const endDate = new Date();
        const metrics = {
            period: {
                start: startDate,
                end: endDate,
                timeWindowHours: timeWindow
            },
            summary: {
                totalVolume: 0,
                totalValue: 0,
                totalTransactions: 0,
                averagePrice: 0,
                renewableEnergyPercentage: 0,
                marketEfficiencyScore: 0
            }
        };
        const volumeMetrics = await this.getVolumeMetrics(startDate, endDate);
        metrics.summary.totalVolume = volumeMetrics.totalVolume;
        metrics.summary.totalValue = volumeMetrics.totalValue;
        metrics.summary.totalTransactions = volumeMetrics.totalTransactions;
        metrics.summary.averagePrice = volumeMetrics.averagePrice;
        if (params.includeRenewableMetrics) {
            const renewableMetrics = await this.getRenewableEnergyMetrics(startDate, endDate);
            metrics.summary.renewableEnergyPercentage = renewableMetrics.percentage;
        }
        if (params.includeMarketEfficiency) {
            const efficiencyMetrics = await this.getMarketEfficiencyMetrics(startDate, endDate);
            metrics.summary.marketEfficiencyScore = efficiencyMetrics.score;
        }
        if (params.includeGeographicBreakdown) {
            metrics.geographicBreakdown = await this.getGeographicBreakdown(startDate, endDate);
        }
        metrics.topPerformers = await this.getTopPerformers(startDate, endDate, 10);
        metrics.recentTrends = await this.getRecentTrends(startDate, endDate);
        return metrics;
    }
    async storeAnalyticsData(data) {
        const analyticsData = this.analyticsRepository.create(data);
        return this.analyticsRepository.save(analyticsData);
    }
    async getAnalyticsData(type, period, startDate, endDate, userId, gridZoneId, country) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .where('analytics.type = :type', { type })
            .andWhere('analytics.period = :period', { period });
        if (startDate && endDate) {
            queryBuilder.andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }
        if (userId) {
            queryBuilder.andWhere('analytics.userId = :userId', { userId });
        }
        if (gridZoneId) {
            queryBuilder.andWhere('analytics.gridZoneId = :gridZoneId', { gridZoneId });
        }
        if (country) {
            queryBuilder.andWhere('analytics.country = :country', { country });
        }
        queryBuilder.orderBy('analytics.timestamp', 'DESC');
        return queryBuilder.getMany();
    }
    async exportReport(reportData, format) {
        switch (format) {
            case 'json':
                return JSON.stringify(reportData, null, 2);
            case 'csv':
                return this.convertToCSV(reportData);
            case 'pdf':
                return this.convertToPDF(reportData);
            default:
                throw new common_1.BadRequestException(`Unsupported format: ${format}`);
        }
    }
    async scheduleReport(reportType, schedule, recipients, params) {
        console.log(`Scheduling ${reportType} report with schedule: ${schedule}`);
        console.log(`Recipients: ${recipients.join(', ')}`);
        console.log(`Params:`, params);
    }
    async getVolumeMetrics(startDate, endDate) {
        const result = await this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('SUM(analytics.count)', 'totalVolume')
            .addSelect('SUM(analytics.totalValue)', 'totalValue')
            .addSelect('COUNT(analytics.id)', 'totalTransactions')
            .addSelect('AVG(analytics.averageValue)', 'averagePrice')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.TRADING_VOLUME })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .getRawOne();
        return {
            totalVolume: parseInt(result?.totalVolume || '0'),
            totalValue: parseFloat(result?.totalValue || '0'),
            totalTransactions: parseInt(result?.totalTransactions || '0'),
            averagePrice: parseFloat(result?.averagePrice || '0')
        };
    }
    async getRenewableEnergyMetrics(startDate, endDate) {
        const totalVolumeQuery = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('SUM(analytics.count)', 'totalVolume')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.TRADING_VOLUME })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        });
        const renewableVolumeQuery = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('SUM(analytics.count)', 'renewableVolume')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.RENEWABLE_ENERGY })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        });
        const [totalVolumeResult, renewableVolumeResult] = await Promise.all([
            totalVolumeQuery.getRawOne(),
            renewableVolumeQuery.getRawOne()
        ]);
        const totalVolume = parseInt(totalVolumeResult?.totalVolume || '0');
        const renewableVolume = parseInt(renewableVolumeResult?.renewableVolume || '0');
        return {
            totalVolume,
            renewableVolume,
            percentage: totalVolume > 0 ? (renewableVolume / totalVolume) * 100 : 0
        };
    }
    async getMarketEfficiencyMetrics(startDate, endDate) {
        const result = await this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('AVG(analytics.data->>\'priceEfficiency\')', 'efficiency')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.MARKET_EFFICIENCY })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .getRawOne();
        return {
            score: parseFloat(result?.efficiency || '0') * 100
        };
    }
    async getGeographicBreakdown(startDate, endDate) {
        return this.analyticsRepository
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
            .orderBy('SUM(analytics.count)', 'DESC')
            .limit(10)
            .getRawMany();
    }
    async getTopPerformers(startDate, endDate, limit) {
        return this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('analytics.userId', 'userId')
            .addSelect('SUM(analytics.data->>\'profitLoss\')', 'totalProfitLoss')
            .addSelect('COUNT(analytics.id)', 'tradeCount')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.USER_PERFORMANCE })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .andWhere('analytics.userId IS NOT NULL')
            .groupBy('analytics.userId')
            .orderBy('SUM(analytics.data->>\'profitLoss\')', 'DESC')
            .limit(limit)
            .getRawMany();
    }
    async getRecentTrends(startDate, endDate) {
        const hourlyData = await this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('analytics.timestamp', 'timestamp')
            .addSelect('analytics.data->>\'price\'', 'price')
            .addSelect('analytics.count', 'volume')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.PRICE_TREND })
            .andWhere('analytics.period = :period', { period: analytics_data_entity_1.AggregationPeriod.HOURLY })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .orderBy('analytics.timestamp', 'ASC')
            .limit(24)
            .getRawMany();
        return hourlyData.map(item => ({
            timestamp: item.timestamp,
            price: parseFloat(item.price || '0'),
            volume: parseInt(item.volume || '0')
        }));
    }
    convertToCSV(data) {
        const headers = Object.keys(data).join(',');
        const values = Object.values(data).join(',');
        return `${headers}\n${values}`;
    }
    convertToPDF(data) {
        const content = JSON.stringify(data, null, 2);
        return Buffer.from(content, 'utf-8');
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_data_entity_1.AnalyticsData)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        trading_volume_report_1.TradingVolumeReport,
        price_trends_report_1.PriceTrendsReport,
        user_performance_report_1.UserPerformanceReport,
        market_efficiency_report_1.MarketEfficiencyReport])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map