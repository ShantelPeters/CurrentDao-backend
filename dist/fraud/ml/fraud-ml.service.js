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
var FraudMlService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudMlService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fraud_case_entity_1 = require("../entities/fraud-case.entity");
const fraud_alert_dto_1 = require("../dto/fraud-alert.dto");
let FraudMlService = FraudMlService_1 = class FraudMlService {
    constructor(fraudCaseRepository) {
        this.fraudCaseRepository = fraudCaseRepository;
        this.logger = new common_1.Logger(FraudMlService_1.name);
        this.traderBaselines = new Map();
        this.truePositives = 0;
        this.falsePositives = 0;
        this.modelVersion = '1.0.0';
        this.VOLUME_ANOMALY_MULTIPLIER = 3.0;
        this.FREQUENCY_ANOMALY_MULTIPLIER = 4.0;
        this.HIGH_CANCELLATION_RATE = 0.7;
        this.SUSPICIOUS_ROUND_TRIP_WINDOW_MS = 120000;
        this.MIN_TRADES_FOR_BASELINE = 5;
    }
    async analyzeTrade(tradeDto) {
        const startTime = Date.now();
        this.logger.debug(`ML analysis for trade: ${tradeDto.tradeId}`);
        const baseline = await this.getOrCreateBaseline(tradeDto.traderId);
        const features = this.extractFeatures(tradeDto, baseline);
        const score = this.computeAnomalyScore(features);
        const severity = this.scoreToSeverity(score);
        const topContributors = this.getTopContributors(features);
        const evidence = this.buildEvidence(features, tradeDto, baseline);
        this.updateBaseline(baseline, tradeDto, features);
        const processingTimeMs = Date.now() - startTime;
        this.logger.debug(`ML score for ${tradeDto.tradeId}: ${score.toFixed(4)} (${severity}) in ${processingTimeMs}ms`);
        if (processingTimeMs > 100) {
            this.logger.warn(`ML analysis exceeded 100ms: ${processingTimeMs}ms`);
        }
        return { score, severity, features, topContributors, evidence, processingTimeMs };
    }
    extractFeatures(tradeDto, baseline) {
        return {
            volumeAnomaly: this.computeVolumeAnomaly(tradeDto.quantity, baseline),
            frequencyAnomaly: this.computeFrequencyAnomaly(baseline),
            priceImpactScore: this.computePriceImpact(tradeDto),
            orderToTradeRatio: this.computeOrderToTradeRatio(baseline),
            roundTripScore: this.computeRoundTripScore(tradeDto),
            velocityScore: this.computeVelocityScore(baseline),
            counterpartyConcentration: this.computeCounterpartyConcentration(tradeDto),
            timePatternAnomaly: this.computeTimePatternAnomaly(tradeDto),
            marketImpactScore: this.computeMarketImpact(tradeDto, baseline),
            cancellationRate: baseline.avgOrderToTradeRatio > 0
                ? Math.min(1, baseline.avgOrderToTradeRatio)
                : 0,
        };
    }
    computeVolumeAnomaly(quantity, baseline) {
        if (baseline.tradeCount < this.MIN_TRADES_FOR_BASELINE)
            return 0.1;
        if (baseline.avgVolume === 0)
            return 0.1;
        const ratio = quantity / baseline.avgVolume;
        return Math.min(1, Math.max(0, (ratio - 1) / (this.VOLUME_ANOMALY_MULTIPLIER - 1)));
    }
    computeFrequencyAnomaly(baseline) {
        if (baseline.tradeCount < this.MIN_TRADES_FOR_BASELINE)
            return 0.05;
        const tradesPerHour = baseline.avgFrequency;
        if (tradesPerHour > 100)
            return 1.0;
        if (tradesPerHour > 50)
            return 0.8;
        if (tradesPerHour > 20)
            return 0.5;
        if (tradesPerHour > 10)
            return 0.3;
        return Math.min(0.2, tradesPerHour / 50);
    }
    computePriceImpact(tradeDto) {
        const normalizedValue = tradeDto.tradeValue / 1000000;
        if (normalizedValue > 100)
            return 0.9;
        if (normalizedValue > 50)
            return 0.6;
        if (normalizedValue > 10)
            return 0.3;
        return Math.min(0.2, normalizedValue / 50);
    }
    computeOrderToTradeRatio(baseline) {
        return Math.min(1, Math.max(0, baseline.avgOrderToTradeRatio - 0.3) / 0.7);
    }
    computeRoundTripScore(tradeDto) {
        if (tradeDto.counterpartyId && tradeDto.counterpartyId === tradeDto.traderId) {
            return 1.0;
        }
        return 0.05;
    }
    computeVelocityScore(baseline) {
        const recentFrequency = baseline.avgFrequency;
        return Math.min(1, recentFrequency / this.FREQUENCY_ANOMALY_MULTIPLIER / 10);
    }
    computeCounterpartyConcentration(tradeDto) {
        return tradeDto.counterpartyId ? 0.15 : 0.05;
    }
    computeTimePatternAnomaly(tradeDto) {
        if (!tradeDto.tradeTimestamp)
            return 0.05;
        const hour = new Date(tradeDto.tradeTimestamp).getUTCHours();
        if ((hour >= 8 && hour <= 9) || (hour >= 15 && hour <= 16))
            return 0.3;
        return 0.05;
    }
    computeMarketImpact(tradeDto, baseline) {
        const relativeSize = tradeDto.quantity / Math.max(baseline.avgVolume, 1);
        return Math.min(1, relativeSize / 10);
    }
    computeAnomalyScore(features) {
        const weights = {
            roundTripScore: 0.20,
            volumeAnomaly: 0.18,
            cancellationRate: 0.15,
            frequencyAnomaly: 0.13,
            orderToTradeRatio: 0.12,
            priceImpactScore: 0.08,
            counterpartyConcentration: 0.06,
            marketImpactScore: 0.04,
            timePatternAnomaly: 0.02,
            velocityScore: 0.02,
        };
        let score = 0;
        for (const [feature, weight] of Object.entries(weights)) {
            score += (features[feature] ?? 0) * weight;
        }
        if (score > 0.7)
            score = 0.7 + (score - 0.7) * 1.5;
        return Math.min(1, parseFloat(score.toFixed(4)));
    }
    scoreToSeverity(score) {
        if (score >= 0.85)
            return fraud_alert_dto_1.FraudSeverity.CRITICAL;
        if (score >= 0.65)
            return fraud_alert_dto_1.FraudSeverity.HIGH;
        if (score >= 0.40)
            return fraud_alert_dto_1.FraudSeverity.MEDIUM;
        return fraud_alert_dto_1.FraudSeverity.LOW;
    }
    getTopContributors(features) {
        return Object.entries(features)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([k]) => k);
    }
    buildEvidence(features, tradeDto, baseline) {
        const items = [];
        const now = new Date();
        if (features.roundTripScore > 0.5) {
            items.push({
                type: 'round_trip_detection',
                description: 'Potential round-trip / wash trade detected with same counterparty',
                value: features.roundTripScore,
                timestamp: now,
            });
        }
        if (features.volumeAnomaly > 0.5) {
            items.push({
                type: 'volume_anomaly',
                description: `Trade volume ${tradeDto.quantity} is ${(tradeDto.quantity / Math.max(baseline.avgVolume, 1)).toFixed(1)}x above trader baseline`,
                value: { tradeVolume: tradeDto.quantity, baselineAvg: baseline.avgVolume },
                timestamp: now,
            });
        }
        if (features.cancellationRate > 0.5) {
            items.push({
                type: 'high_cancellation_rate',
                description: 'Trader exhibits high order cancellation rate consistent with spoofing',
                value: features.cancellationRate,
                timestamp: now,
            });
        }
        if (features.frequencyAnomaly > 0.5) {
            items.push({
                type: 'frequency_anomaly',
                description: `Abnormal trading frequency: ${baseline.avgFrequency.toFixed(1)} trades/hour`,
                value: baseline.avgFrequency,
                timestamp: now,
            });
        }
        if (features.priceImpactScore > 0.4) {
            items.push({
                type: 'large_price_impact',
                description: `Trade value $${tradeDto.tradeValue.toLocaleString()} may significantly impact market price`,
                value: tradeDto.tradeValue,
                timestamp: now,
            });
        }
        return items;
    }
    async getOrCreateBaseline(traderId) {
        if (this.traderBaselines.has(traderId)) {
            return this.traderBaselines.get(traderId);
        }
        const historicalCases = await this.fraudCaseRepository.find({
            where: { traderId },
            order: { createdAt: 'DESC' },
            take: 100,
        });
        const baseline = {
            traderId,
            avgVolume: historicalCases.length > 0 ? 1000 : 500,
            avgFrequency: 5,
            avgPriceDeviation: 0.02,
            avgOrderToTradeRatio: 0.1,
            tradeCount: historicalCases.length,
            lastUpdated: new Date(),
        };
        this.traderBaselines.set(traderId, baseline);
        return baseline;
    }
    updateBaseline(baseline, tradeDto, features) {
        const alpha = 0.1;
        baseline.avgVolume = (1 - alpha) * baseline.avgVolume + alpha * tradeDto.quantity;
        baseline.avgFrequency = (1 - alpha) * baseline.avgFrequency + alpha * (baseline.avgFrequency + 0.1);
        baseline.avgPriceDeviation = (1 - alpha) * baseline.avgPriceDeviation + alpha * features.priceImpactScore;
        baseline.tradeCount += 1;
        baseline.lastUpdated = new Date();
    }
    recordFeedback(caseId, wasTruePositive) {
        if (wasTruePositive) {
            this.truePositives++;
        }
        else {
            this.falsePositives++;
            this.logger.log(`False positive feedback recorded for case ${caseId}`);
        }
    }
    getModelMetrics() {
        const total = this.truePositives + this.falsePositives;
        const precision = total > 0 ? this.truePositives / total : 0;
        return {
            modelVersion: this.modelVersion,
            truePositives: this.truePositives,
            falsePositives: this.falsePositives,
            precision: parseFloat(precision.toFixed(4)),
            activeBaselines: this.traderBaselines.size,
        };
    }
};
exports.FraudMlService = FraudMlService;
exports.FraudMlService = FraudMlService = FraudMlService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fraud_case_entity_1.FraudCaseEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FraudMlService);
//# sourceMappingURL=fraud-ml.service.js.map