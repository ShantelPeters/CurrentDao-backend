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
var RealTimeMonitorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeMonitorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const fraud_case_entity_1 = require("../entities/fraud-case.entity");
const fraud_ml_service_1 = require("../ml/fraud-ml.service");
const pattern_recognition_service_1 = require("../patterns/pattern-recognition.service");
const suspicious_activity_service_1 = require("../reporting/suspicious-activity.service");
const fraud_prevention_service_1 = require("../prevention/fraud-prevention.service");
const uuid_1 = require("uuid");
let RealTimeMonitorService = RealTimeMonitorService_1 = class RealTimeMonitorService {
    constructor(fraudCaseRepository, mlService, patternService, reportingService, preventionService) {
        this.fraudCaseRepository = fraudCaseRepository;
        this.mlService = mlService;
        this.patternService = patternService;
        this.reportingService = reportingService;
        this.preventionService = preventionService;
        this.logger = new common_1.Logger(RealTimeMonitorService_1.name);
        this.monitoredTraders = new Map();
        this.pendingTrades = [];
        this.CONTEXT_WINDOW_SIZE = 50;
        this.MONITORING_INTERVAL_MS = 15000;
        this.ALERT_THRESHOLD = 0.65;
        this.monitoringInterval = null;
    }
    async analyzeIncomingTrade(tradeDto) {
        const startTime = Date.now();
        this.logger.debug(`Analyzing incoming trade: ${tradeDto.tradeId}`);
        this.updateTraderContext(tradeDto);
        const context = this.getTraderContext(tradeDto.traderId);
        const mlResult = await this.mlService.analyzeTrade(tradeDto);
        const patterns = this.patternService.analyzePatterns(tradeDto, {
            recentTrades: context.recentTrades.filter((t) => t.tradeId !== tradeDto.tradeId),
        });
        const matchedPatterns = patterns.filter((p) => p.matched);
        const combinedScore = this.combineScores(mlResult.score, matchedPatterns);
        const isSuspicious = combinedScore >= this.ALERT_THRESHOLD;
        const fraudTypes = this.patternService.inferFraudTypes(matchedPatterns);
        const severity = this.scoreToSeverity(combinedScore);
        let savedCaseId = '';
        if (isSuspicious) {
            const savedCase = await this.createFraudCase(tradeDto, combinedScore, severity, fraudTypes, matchedPatterns, mlResult.evidence);
            savedCaseId = savedCase.caseId;
        }
        const processingTimeMs = Date.now() - startTime;
        const result = {
            caseId: savedCaseId,
            tradeId: tradeDto.tradeId,
            traderId: tradeDto.traderId,
            isSuspicious,
            mlScore: combinedScore,
            severity,
            fraudTypes,
            patternsMatched: matchedPatterns,
            evidence: mlResult.evidence,
            recommendedAction: this.getRecommendedAction(severity, combinedScore),
            processingTimeMs,
        };
        if (processingTimeMs > 100) {
            this.logger.warn(`Trade analysis exceeded 100ms: ${processingTimeMs}ms`);
        }
        return result;
    }
    startTraderMonitoring(traderId) {
        if (this.monitoredTraders.has(traderId)) {
            this.logger.debug(`Monitoring already active for trader: ${traderId}`);
            return;
        }
        const session = {
            traderId,
            startedAt: new Date(),
            recentTrades: [],
            alertCount: 0,
            lastChecked: new Date(),
        };
        this.monitoredTraders.set(traderId, session);
        this.logger.log(`Started monitoring trader: ${traderId}`);
    }
    stopTraderMonitoring(traderId) {
        if (this.monitoredTraders.delete(traderId)) {
            this.logger.log(`Stopped monitoring trader: ${traderId}`);
        }
    }
    startGlobalMonitoring() {
        if (this.monitoringInterval)
            return;
        this.monitoringInterval = setInterval(async () => {
            await this.processMonitoringCycle();
        }, this.MONITORING_INTERVAL_MS);
        this.logger.log(`Global fraud monitoring started (interval: ${this.MONITORING_INTERVAL_MS}ms)`);
    }
    stopGlobalMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            this.logger.log('Global fraud monitoring stopped');
        }
    }
    getMonitoringStatus() {
        return {
            isRunning: this.monitoringInterval !== null,
            monitoredTraderCount: this.monitoredTraders.size,
            pendingTradesQueue: this.pendingTrades.length,
            monitoredTraders: Array.from(this.monitoredTraders.keys()),
            intervalMs: this.MONITORING_INTERVAL_MS,
            alertThreshold: this.ALERT_THRESHOLD,
        };
    }
    async processMonitoringCycle() {
        if (this.pendingTrades.length === 0 && this.monitoredTraders.size === 0)
            return;
        this.logger.debug(`Monitoring cycle: ${this.pendingTrades.length} queued trades`);
        const batch = this.pendingTrades.splice(0, 100);
        for (const trade of batch) {
            try {
                await this.analyzeIncomingTrade(trade);
            }
            catch (err) {
                this.logger.error(`Error analyzing trade ${trade.tradeId}: ${err}`);
            }
        }
        for (const [traderId, session] of this.monitoredTraders) {
            await this.sweepTrader(traderId, session);
        }
    }
    async generateMonitoringReport() {
        const activeCount = this.monitoredTraders.size;
        if (activeCount === 0)
            return;
        const openCases = await this.fraudCaseRepository.count({
            where: { status: fraud_case_entity_1.FraudCaseStatus.OPEN },
        });
        this.logger.log(`Fraud monitoring report: ${activeCount} monitored traders, ${openCases} open cases`);
    }
    async hourlyEscalation() {
        this.logger.log('Running hourly escalation sweep');
        const criticalCases = await this.fraudCaseRepository.find({
            where: { severity: fraud_case_entity_1.FraudSeverity.CRITICAL, status: fraud_case_entity_1.FraudCaseStatus.OPEN },
        });
        for (const c of criticalCases) {
            await this.fraudCaseRepository.update(c.id, {
                status: fraud_case_entity_1.FraudCaseStatus.ESCALATED,
            });
            this.logger.warn(`CRITICAL case escalated: ${c.caseId} — trader ${c.traderId}`);
        }
    }
    async sweepTrader(traderId, session) {
        const timeSinceCheck = Date.now() - session.lastChecked.getTime();
        if (timeSinceCheck < this.MONITORING_INTERVAL_MS)
            return;
        session.lastChecked = new Date();
        if (session.recentTrades.length === 0)
            return;
        const highValueTrades = session.recentTrades.filter((t) => t.tradeValue > 1000000);
        if (highValueTrades.length >= 3) {
            this.logger.warn(`Trader ${traderId} has ${highValueTrades.length} high-value trades in monitoring window`);
            session.alertCount++;
        }
    }
    updateTraderContext(tradeDto) {
        if (!this.monitoredTraders.has(tradeDto.traderId)) {
            this.startTraderMonitoring(tradeDto.traderId);
        }
        const session = this.monitoredTraders.get(tradeDto.traderId);
        session.recentTrades.push(tradeDto);
        if (session.recentTrades.length > this.CONTEXT_WINDOW_SIZE) {
            session.recentTrades.shift();
        }
    }
    enqueuePendingTrade(tradeDto) {
        this.pendingTrades.push(tradeDto);
        this.updateTraderContext(tradeDto);
    }
    getTraderContext(traderId) {
        return this.monitoredTraders.get(traderId) ?? {
            traderId,
            startedAt: new Date(),
            recentTrades: [],
            alertCount: 0,
            lastChecked: new Date(),
        };
    }
    combineScores(mlScore, matchedPatterns) {
        if (matchedPatterns.length === 0)
            return mlScore;
        const avgPatternScore = matchedPatterns.reduce((s, p) => s + p.confidence, 0) / matchedPatterns.length;
        const combined = mlScore * 0.6 + avgPatternScore * 0.4;
        const boost = mlScore > 0.5 && avgPatternScore > 0.5 ? 0.1 : 0;
        return Math.min(1, parseFloat((combined + boost).toFixed(4)));
    }
    scoreToSeverity(score) {
        if (score >= 0.85)
            return fraud_case_entity_1.FraudSeverity.CRITICAL;
        if (score >= 0.65)
            return fraud_case_entity_1.FraudSeverity.HIGH;
        if (score >= 0.40)
            return fraud_case_entity_1.FraudSeverity.MEDIUM;
        return fraud_case_entity_1.FraudSeverity.LOW;
    }
    getRecommendedAction(severity, score) {
        if (severity === fraud_case_entity_1.FraudSeverity.CRITICAL || score >= 0.90) {
            return 'BLOCK_TRADE: Immediate block and escalate to compliance';
        }
        if (severity === fraud_case_entity_1.FraudSeverity.HIGH) {
            return 'HOLD_AND_REVIEW: Flag for manual investigator review within 1 hour';
        }
        if (severity === fraud_case_entity_1.FraudSeverity.MEDIUM) {
            return 'MONITOR: Continue monitoring, alert on next suspicious activity';
        }
        return 'LOG: No action required, trade logged for audit trail';
    }
    generateCaseId() {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `FRAUD-${date}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
    }
    async createFraudCase(tradeDto, score, severity, fraudTypes, patterns, evidence) {
        const caseId = this.generateCaseId();
        const fraudCase = this.fraudCaseRepository.create({
            caseId,
            tradeId: tradeDto.tradeId,
            traderId: tradeDto.traderId,
            counterpartyId: tradeDto.counterpartyId,
            fraudType: fraudTypes[0] ?? 'unknown',
            severity,
            status: fraud_case_entity_1.FraudCaseStatus.OPEN,
            mlScore: score,
            patternMatched: patterns[0]?.patternName ?? null,
            patternsTriggered: patterns.map((p) => p.patternId),
            evidence,
            tradeData: {
                market: tradeDto.market,
                assetType: tradeDto.assetType,
                quantity: tradeDto.quantity,
                price: tradeDto.price,
                side: tradeDto.side,
            },
            market: tradeDto.market,
            assetType: tradeDto.assetType,
            tradeValue: tradeDto.tradeValue,
            regulatoryReported: false,
            preventionApplied: severity === fraud_case_entity_1.FraudSeverity.CRITICAL,
            preventionAction: severity === fraud_case_entity_1.FraudSeverity.CRITICAL ? 'auto_block' : null,
        });
        const saved = await this.fraudCaseRepository.save(fraudCase);
        if (severity === fraud_case_entity_1.FraudSeverity.HIGH || severity === fraud_case_entity_1.FraudSeverity.CRITICAL) {
            await this.reportingService.generateSAR(saved);
        }
        this.logger.warn(`Fraud case created: ${caseId} | Trader: ${tradeDto.traderId} | Score: ${score} | Severity: ${severity}`);
        return saved;
    }
    onModuleDestroy() {
        this.stopGlobalMonitoring();
        this.monitoredTraders.clear();
    }
};
exports.RealTimeMonitorService = RealTimeMonitorService;
__decorate([
    (0, schedule_1.Cron)('*/15 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealTimeMonitorService.prototype, "processMonitoringCycle", null);
__decorate([
    (0, schedule_1.Cron)('0 */1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealTimeMonitorService.prototype, "generateMonitoringReport", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealTimeMonitorService.prototype, "hourlyEscalation", null);
exports.RealTimeMonitorService = RealTimeMonitorService = RealTimeMonitorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fraud_case_entity_1.FraudCaseEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        fraud_ml_service_1.FraudMlService,
        pattern_recognition_service_1.PatternRecognitionService,
        suspicious_activity_service_1.SuspiciousActivityService,
        fraud_prevention_service_1.FraudPreventionService])
], RealTimeMonitorService);
//# sourceMappingURL=real-time-monitor.service.js.map