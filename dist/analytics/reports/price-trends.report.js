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
exports.PriceTrendsReport = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_data_entity_1 = require("../entities/analytics-data.entity");
let PriceTrendsReport = class PriceTrendsReport {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    async generateReport(params) {
        const startDate = params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = params.endDate || new Date();
        const period = params.period || analytics_data_entity_1.AggregationPeriod.DAILY;
        const priceData = await this.fetchPriceData(startDate, endDate, period, params);
        const summary = this.calculateSummary(priceData);
        const technicalIndicators = params.includeTechnicalIndicators
            ? this.generateTechnicalIndicators(priceData)
            : undefined;
        const comparativeAnalysis = params.includeComparativeAnalysis
            ? await this.getComparativeAnalysis(startDate, endDate, period, params)
            : undefined;
        return {
            period: {
                start: startDate,
                end: endDate,
                aggregation: period
            },
            summary,
            data: priceData,
            technicalIndicators,
            comparativeAnalysis
        };
    }
    async fetchPriceData(startDate, endDate, period, params) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.PRICE_TREND })
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
        return analyticsData.map(data => {
            const priceData = data.data;
            return {
                timestamp: data.timestamp,
                price: parseFloat(priceData.price || '0'),
                volume: parseFloat(priceData.volume || '0'),
                high: parseFloat(priceData.high || '0'),
                low: parseFloat(priceData.low || '0'),
                open: parseFloat(priceData.open || '0'),
                close: parseFloat(priceData.close || '0')
            };
        });
    }
    calculateSummary(data) {
        if (data.length === 0) {
            return {
                currentPrice: 0,
                priceChange: 0,
                priceChangePercent: 0,
                volatility: 0,
                averagePrice: 0,
                highestPrice: 0,
                lowestPrice: 0,
                trend: 'SIDEWAYS'
            };
        }
        const currentPrice = data[data.length - 1].close;
        const firstPrice = data[0].open;
        const priceChange = currentPrice - firstPrice;
        const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
        const prices = data.map(d => d.close);
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const highestPrice = Math.max(...prices);
        const lowestPrice = Math.min(...prices);
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            if (prices[i - 1] > 0) {
                returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
            }
        }
        const volatility = returns.length > 0 ? this.calculateStandardDeviation(returns) * 100 : 0;
        let trend = 'SIDEWAYS';
        if (priceChangePercent > 2)
            trend = 'BULLISH';
        else if (priceChangePercent < -2)
            trend = 'BEARISH';
        return {
            currentPrice,
            priceChange,
            priceChangePercent,
            volatility,
            averagePrice,
            highestPrice,
            lowestPrice,
            trend
        };
    }
    generateTechnicalIndicators(data) {
        const indicators = [];
        const prices = data.map(d => d.close);
        const sma20 = this.calculateSMA(prices, 20);
        indicators.push({
            name: 'SMA_20',
            values: sma20,
            signals: this.generateSMASignals(prices, sma20)
        });
        const ema50 = this.calculateEMA(prices, 50);
        indicators.push({
            name: 'EMA_50',
            values: ema50,
            signals: this.generateEMASignals(prices, ema50)
        });
        const rsi = this.calculateRSI(prices, 14);
        indicators.push({
            name: 'RSI_14',
            values: rsi,
            signals: this.generateRSISignals(rsi)
        });
        const macd = this.calculateMACD(prices);
        indicators.push({
            name: 'MACD',
            values: macd.macdLine,
            signals: this.generateMACDSignals(macd)
        });
        return indicators;
    }
    calculateSMA(prices, period) {
        const sma = [];
        for (let i = period - 1; i < prices.length; i++) {
            const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            sma.push(sum / period);
        }
        return sma;
    }
    calculateEMA(prices, period) {
        const ema = [];
        const multiplier = 2 / (period + 1);
        const sma = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
        ema.push(sma);
        for (let i = period; i < prices.length; i++) {
            const currentEMA = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
            ema.push(currentEMA);
        }
        return ema;
    }
    calculateRSI(prices, period) {
        const rsi = [];
        const gains = [];
        const losses = [];
        for (let i = 1; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        for (let i = period - 1; i < gains.length; i++) {
            const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
            const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
            const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            rsi.push(100 - (100 / (1 + rs)));
        }
        return rsi;
    }
    calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macdLine = ema12.map((val, i) => val - ema26[i + (ema12.length - ema26.length)]);
        const signalLine = this.calculateEMA(macdLine, 9);
        const histogram = macdLine.map((val, i) => val - (signalLine[i - (signalLine.length - macdLine.length)] || 0));
        return { macdLine, signalLine, histogram };
    }
    generateSMASignals(prices, sma) {
        const signals = [];
        for (let i = 0; i < sma.length; i++) {
            const priceIndex = i + (prices.length - sma.length);
            if (prices[priceIndex] > sma[i]) {
                signals.push('BUY');
            }
            else if (prices[priceIndex] < sma[i]) {
                signals.push('SELL');
            }
            else {
                signals.push('HOLD');
            }
        }
        return signals;
    }
    generateEMASignals(prices, ema) {
        return this.generateSMASignals(prices, ema);
    }
    generateRSISignals(rsi) {
        return rsi.map(value => {
            if (value < 30)
                return 'BUY';
            if (value > 70)
                return 'SELL';
            return 'HOLD';
        });
    }
    generateMACDSignals(macd) {
        const signals = [];
        const minLength = Math.min(macd.macdLine.length, macd.signalLine.length);
        for (let i = 0; i < minLength; i++) {
            if (macd.macdLine[i] > macd.signalLine[i]) {
                signals.push('BUY');
            }
            else if (macd.macdLine[i] < macd.signalLine[i]) {
                signals.push('SELL');
            }
            else {
                signals.push('HOLD');
            }
        }
        return signals;
    }
    async getComparativeAnalysis(startDate, endDate, period, params) {
        const queryBuilder = this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('analytics.country', 'region')
            .addSelect('AVG(analytics.averageValue)', 'averagePrice')
            .where('analytics.type = :type', { type: analytics_data_entity_1.AnalyticsType.PRICE_TREND })
            .andWhere('analytics.period = :period', { period })
            .andWhere('analytics.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate
        })
            .andWhere('analytics.country IS NOT NULL')
            .groupBy('analytics.country');
        if (params.userId) {
            queryBuilder.andWhere('analytics.userId = :userId', { userId: params.userId });
        }
        const results = await queryBuilder.getRawMany();
        return results.map(result => ({
            region: result.region,
            averagePrice: parseFloat(result.averagePrice || '0'),
            priceChange: 0,
            volatility: 0
        }));
    }
    calculateStandardDeviation(values) {
        const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
        const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
        const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / values.length;
        return Math.sqrt(variance);
    }
};
exports.PriceTrendsReport = PriceTrendsReport;
exports.PriceTrendsReport = PriceTrendsReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_data_entity_1.AnalyticsData)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PriceTrendsReport);
//# sourceMappingURL=price-trends.report.js.map