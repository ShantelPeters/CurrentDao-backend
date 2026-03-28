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
var FraudPreventionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudPreventionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fraud_case_entity_1 = require("../entities/fraud-case.entity");
let FraudPreventionService = FraudPreventionService_1 = class FraudPreventionService {
    constructor(fraudCaseRepository) {
        this.fraudCaseRepository = fraudCaseRepository;
        this.logger = new common_1.Logger(FraudPreventionService_1.name);
        this.blockedTraders = new Map();
        this.whitelist = new Set();
        this.stats = {
            totalChecks: 0,
            blockedTrades: 0,
            blockedValue: 0,
            whitelistedPassed: 0,
            blockRate: 0,
        };
        this.BLOCK_THRESHOLD = 0.85;
        this.REVIEW_THRESHOLD = 0.65;
        this.RATE_LIMIT_PER_MINUTE = 60;
        this.traderRateCounts = new Map();
    }
    async preTradeCheck(checkDto, mlScore) {
        this.stats.totalChecks++;
        const { traderId, tradeValue = 0 } = checkDto;
        const reasons = [];
        if (this.whitelist.has(traderId)) {
            this.stats.whitelistedPassed++;
            return { allowed: true, riskScore: 0, reasons: ['Whitelisted trader'], recommendedAction: 'allow' };
        }
        const blockEntry = this.blockedTraders.get(traderId);
        if (blockEntry) {
            const isExpired = blockEntry.expiresAt && blockEntry.expiresAt < new Date();
            if (!isExpired) {
                reasons.push(`Trader blocked: ${blockEntry.reason}`);
                this.recordPrevention(traderId, tradeValue ?? 0);
                return { allowed: false, riskScore: 1.0, reasons, recommendedAction: 'block' };
            }
            else {
                this.blockedTraders.delete(traderId);
            }
        }
        const isRateLimited = this.checkRateLimit(traderId);
        if (isRateLimited) {
            reasons.push(`Rate limit exceeded: >${this.RATE_LIMIT_PER_MINUTE} trades/min`);
            this.recordPrevention(traderId, tradeValue ?? 0);
            return { allowed: false, riskScore: 0.9, reasons, recommendedAction: 'block' };
        }
        if (mlScore !== undefined) {
            if (mlScore >= this.BLOCK_THRESHOLD) {
                reasons.push(`ML fraud score ${mlScore.toFixed(3)} exceeds block threshold ${this.BLOCK_THRESHOLD}`);
                this.recordPrevention(traderId, tradeValue ?? 0);
                return { allowed: false, riskScore: mlScore, reasons, recommendedAction: 'block' };
            }
            if (mlScore >= this.REVIEW_THRESHOLD) {
                reasons.push(`ML fraud score ${mlScore.toFixed(3)} requires manual review`);
                return { allowed: true, riskScore: mlScore, reasons, recommendedAction: 'review' };
            }
        }
        if (tradeValue > 50000000) {
            reasons.push(`Trade value $${tradeValue.toLocaleString()} exceeds large-trade threshold`);
            return { allowed: true, riskScore: 0.5, reasons, recommendedAction: 'review' };
        }
        if (checkDto.counterpartyId && checkDto.counterpartyId === traderId) {
            reasons.push('Self-trade detected: buyer and seller are the same entity');
            this.recordPrevention(traderId, tradeValue ?? 0);
            return { allowed: false, riskScore: 1.0, reasons, recommendedAction: 'block' };
        }
        const priorCases = await this.fraudCaseRepository.count({
            where: { traderId, status: fraud_case_entity_1.FraudCaseStatus.OPEN },
        });
        if (priorCases >= 3) {
            reasons.push(`Trader has ${priorCases} open fraud cases`);
            return { allowed: false, riskScore: 0.8, reasons, recommendedAction: 'block' };
        }
        this.updateRateCount(traderId);
        return {
            allowed: true,
            riskScore: mlScore ?? 0,
            reasons: reasons.length > 0 ? reasons : ['No fraud indicators detected'],
            recommendedAction: 'allow',
        };
    }
    blockTrader(traderId, reason, severity, durationHours) {
        const expiresAt = durationHours
            ? new Date(Date.now() + durationHours * 3600000)
            : null;
        this.blockedTraders.set(traderId, {
            traderId,
            reason,
            blockedAt: new Date(),
            expiresAt,
            severity,
        });
        this.logger.warn(`Trader BLOCKED: ${traderId} | Reason: ${reason} | Expires: ${expiresAt?.toISOString() ?? 'Never'}`);
    }
    unblockTrader(traderId) {
        const removed = this.blockedTraders.delete(traderId);
        if (removed) {
            this.logger.log(`Trader UNBLOCKED: ${traderId}`);
        }
        return removed;
    }
    isTraderBlocked(traderId) {
        const entry = this.blockedTraders.get(traderId);
        if (!entry)
            return false;
        if (entry.expiresAt && entry.expiresAt < new Date()) {
            this.blockedTraders.delete(traderId);
            return false;
        }
        return true;
    }
    getBlockedTraders() {
        return Array.from(this.blockedTraders.values());
    }
    addToWhitelist(traderId) {
        this.whitelist.add(traderId);
        this.logger.log(`Trader added to whitelist: ${traderId}`);
    }
    removeFromWhitelist(traderId) {
        this.whitelist.delete(traderId);
        this.logger.log(`Trader removed from whitelist: ${traderId}`);
    }
    getWhitelist() {
        return Array.from(this.whitelist);
    }
    getPreventionStats() {
        const blockRate = this.stats.totalChecks > 0
            ? parseFloat((this.stats.blockedTrades / this.stats.totalChecks).toFixed(4))
            : 0;
        return {
            ...this.stats,
            blockRate,
            activeBlocks: this.blockedTraders.size,
            whitelistedTraders: this.whitelist.size,
            blockThreshold: this.BLOCK_THRESHOLD,
            reviewThreshold: this.REVIEW_THRESHOLD,
            rateLimitPerMinute: this.RATE_LIMIT_PER_MINUTE,
        };
    }
    async applyPreventionForCase(fraudCase) {
        if (fraudCase.severity === fraud_case_entity_1.FraudSeverity.CRITICAL) {
            this.blockTrader(fraudCase.traderId, `Auto-blocked: CRITICAL fraud case ${fraudCase.caseId} (ML score ${fraudCase.mlScore})`, fraud_case_entity_1.FraudSeverity.CRITICAL, 24);
        }
        else if (fraudCase.severity === fraud_case_entity_1.FraudSeverity.HIGH) {
            this.blockTrader(fraudCase.traderId, `Auto-blocked: HIGH severity case ${fraudCase.caseId}`, fraud_case_entity_1.FraudSeverity.HIGH, 4);
        }
    }
    checkRateLimit(traderId) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const timestamps = this.traderRateCounts.get(traderId) ?? [];
        const recent = timestamps.filter((ts) => ts > oneMinuteAgo);
        this.traderRateCounts.set(traderId, recent);
        return recent.length >= this.RATE_LIMIT_PER_MINUTE;
    }
    updateRateCount(traderId) {
        const timestamps = this.traderRateCounts.get(traderId) ?? [];
        timestamps.push(Date.now());
        this.traderRateCounts.set(traderId, timestamps);
    }
    recordPrevention(traderId, tradeValue) {
        this.stats.blockedTrades++;
        this.stats.blockedValue += tradeValue;
        this.stats.blockRate =
            this.stats.totalChecks > 0
                ? this.stats.blockedTrades / this.stats.totalChecks
                : 0;
        this.logger.warn(`Trade PREVENTED for trader ${traderId} | Value: $${tradeValue.toLocaleString()} | Total prevented: ${this.stats.blockedTrades}`);
    }
};
exports.FraudPreventionService = FraudPreventionService;
exports.FraudPreventionService = FraudPreventionService = FraudPreventionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fraud_case_entity_1.FraudCaseEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FraudPreventionService);
//# sourceMappingURL=fraud-prevention.service.js.map