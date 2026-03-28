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
var SuspiciousActivityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuspiciousActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const fraud_case_entity_1 = require("../entities/fraud-case.entity");
const uuid_1 = require("uuid");
let SuspiciousActivityService = SuspiciousActivityService_1 = class SuspiciousActivityService {
    constructor(fraudCaseRepository) {
        this.fraudCaseRepository = fraudCaseRepository;
        this.logger = new common_1.Logger(SuspiciousActivityService_1.name);
    }
    async generateSAR(fraudCase) {
        const sarReference = `SAR-${new Date().getFullYear()}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        const sar = {
            sarReference,
            generatedAt: new Date(),
            caseId: fraudCase.caseId,
            traderId: fraudCase.traderId,
            fraudType: fraudCase.fraudType,
            severity: fraudCase.severity,
            summary: this.buildSarSummary(fraudCase),
            evidence: fraudCase.evidence ?? [],
            tradeData: fraudCase.tradeData ?? {},
            mlScore: Number(fraudCase.mlScore),
            patternsMatched: fraudCase.patternsTriggered ?? [],
            reportingObligation: this.determineReportingObligation(fraudCase.severity),
            regulatoryBodies: this.getApplicableRegulators(fraudCase.market ?? '', fraudCase.fraudType),
        };
        await this.fraudCaseRepository.update(fraudCase.id, {
            sarReference,
            regulatoryReported: fraudCase.severity === fraud_case_entity_1.FraudSeverity.CRITICAL,
            status: fraudCase.severity === fraud_case_entity_1.FraudSeverity.CRITICAL
                ? fraud_case_entity_1.FraudCaseStatus.REGULATORY_REPORTED
                : fraudCase.status,
        });
        this.logger.log(`SAR generated: ${sarReference} for case ${fraudCase.caseId}`);
        return sar;
    }
    async generateSARById(caseId) {
        const fraudCase = await this.fraudCaseRepository.findOne({ where: { caseId } });
        if (!fraudCase)
            return null;
        return this.generateSAR(fraudCase);
    }
    async queryCases(queryDto) {
        const { fraudType, severity, status, traderId, startDate, endDate, page = 1, limit = 20, minMlScore, regulatoryReported, } = queryDto;
        const where = {};
        if (fraudType)
            where['fraudType'] = fraudType;
        if (severity)
            where['severity'] = severity;
        if (status)
            where['status'] = status;
        if (traderId)
            where['traderId'] = traderId;
        if (regulatoryReported !== undefined)
            where['regulatoryReported'] = regulatoryReported;
        if (startDate && endDate) {
            where['createdAt'] = (0, typeorm_2.Between)(new Date(startDate), new Date(endDate));
        }
        const [data, total] = await this.fraudCaseRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const filtered = minMlScore
            ? data.filter((c) => Number(c.mlScore) >= minMlScore)
            : data;
        return {
            data: filtered,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getCaseById(id) {
        return this.fraudCaseRepository.findOne({ where: { id } });
    }
    async getCaseByCaseId(caseId) {
        return this.fraudCaseRepository.findOne({ where: { caseId } });
    }
    async updateCase(id, update) {
        const updates = {
            status: update.status,
        };
        if (update.investigationNotes)
            updates.investigationNotes = update.investigationNotes;
        if (update.assignedTo)
            updates.assignedTo = update.assignedTo;
        if (update.falsePositiveReason)
            updates.falsePositiveReason = update.falsePositiveReason;
        if (update.resolvedBy)
            updates.resolvedBy = update.resolvedBy;
        if (update.status === fraud_case_entity_1.FraudCaseStatus.RESOLVED ||
            update.status === fraud_case_entity_1.FraudCaseStatus.FALSE_POSITIVE) {
            updates.resolvedAt = new Date();
        }
        await this.fraudCaseRepository.update(id, updates);
        this.logger.log(`Case ${id} updated to status: ${update.status}`);
        return this.fraudCaseRepository.findOne({ where: { id } });
    }
    async getCasesByTrader(traderId, page = 1, limit = 20) {
        const [data, total] = await this.fraudCaseRepository.findAndCount({
            where: { traderId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getMetrics() {
        const [totalCases, openCases, resolvedCases, falsePositives, criticalCases] = await Promise.all([
            this.fraudCaseRepository.count(),
            this.fraudCaseRepository.count({ where: { status: fraud_case_entity_1.FraudCaseStatus.OPEN } }),
            this.fraudCaseRepository.count({ where: { status: fraud_case_entity_1.FraudCaseStatus.RESOLVED } }),
            this.fraudCaseRepository.count({ where: { status: fraud_case_entity_1.FraudCaseStatus.FALSE_POSITIVE } }),
            this.fraudCaseRepository.count({ where: { severity: fraud_case_entity_1.FraudSeverity.CRITICAL } }),
        ]);
        const allCases = await this.fraudCaseRepository.find({ take: 1000 });
        const avgMlScore = allCases.length > 0
            ? allCases.reduce((s, c) => s + Number(c.mlScore), 0) / allCases.length
            : 0;
        const falsePositiveRate = totalCases > 0 ? parseFloat((falsePositives / totalCases).toFixed(4)) : 0;
        const detectionRate = totalCases > 0
            ? parseFloat(((totalCases - falsePositives) / totalCases).toFixed(4))
            : 0;
        const casesByType = {};
        const casesBySeverity = {};
        for (const c of allCases) {
            casesByType[c.fraudType] = (casesByType[c.fraudType] ?? 0) + 1;
            casesBySeverity[c.severity] = (casesBySeverity[c.severity] ?? 0) + 1;
        }
        const resolvedWithTime = allCases.filter((c) => c.resolvedAt && c.createdAt);
        const avgResolutionHours = resolvedWithTime.length > 0
            ? resolvedWithTime.reduce((s, c) => s + (c.resolvedAt.getTime() - c.createdAt.getTime()) / 3600000, 0) / resolvedWithTime.length
            : 0;
        return {
            totalCases,
            openCases,
            resolvedCases,
            falsePositives,
            criticalCases,
            falsePositiveRate,
            detectionRate,
            averageMlScore: parseFloat(avgMlScore.toFixed(4)),
            casesByType,
            casesBySeverity,
            averageResolutionTimeHours: parseFloat(avgResolutionHours.toFixed(2)),
        };
    }
    async dailySarSweep() {
        this.logger.log('Running daily SAR sweep for unprocessed critical cases');
        const unreported = await this.fraudCaseRepository.find({
            where: {
                severity: fraud_case_entity_1.FraudSeverity.CRITICAL,
                regulatoryReported: false,
                status: fraud_case_entity_1.FraudCaseStatus.OPEN,
            },
        });
        for (const fraudCase of unreported) {
            await this.generateSAR(fraudCase);
        }
        this.logger.log(`Daily SAR sweep complete: processed ${unreported.length} cases`);
    }
    async weeklyComplianceReport() {
        const metrics = await this.getMetrics();
        this.logger.log(`Weekly Fraud Compliance Report: ${JSON.stringify(metrics, null, 2)}`);
    }
    buildSarSummary(fraudCase) {
        return (`Suspicious Activity Report: ${fraudCase.fraudType.replace(/_/g, ' ').toUpperCase()} ` +
            `detected for trader ${fraudCase.traderId}. ` +
            `ML confidence score: ${Number(fraudCase.mlScore).toFixed(2)}. ` +
            `Severity: ${fraudCase.severity.toUpperCase()}. ` +
            `Patterns triggered: ${(fraudCase.patternsTriggered ?? []).join(', ')}. ` +
            `Market: ${fraudCase.market ?? 'Unknown'}. ` +
            `Trade value: $${Number(fraudCase.tradeValue ?? 0).toLocaleString()}.`);
    }
    determineReportingObligation(severity) {
        switch (severity) {
            case fraud_case_entity_1.FraudSeverity.CRITICAL:
                return 'MANDATORY: File SAR within 30 days per FinCEN/REMIT regulations';
            case fraud_case_entity_1.FraudSeverity.HIGH:
                return 'REQUIRED: File SAR within 60 days; notify compliance immediately';
            case fraud_case_entity_1.FraudSeverity.MEDIUM:
                return 'RECOMMENDED: File SAR and retain records for 5 years';
            default:
                return 'OPTIONAL: Log and monitor; no immediate SAR required';
        }
    }
    getApplicableRegulators(market, fraudType) {
        const regulators = ['FinCEN', 'CFTC'];
        if (market.includes('EU') || market.includes('ETS'))
            regulators.push('ACER', 'ESMA');
        if (market.includes('PJM') || market.includes('ERCOT'))
            regulators.push('FERC', 'NERC');
        if (market.includes('GB') || market.includes('UK'))
            regulators.push('Ofgem', 'FCA');
        if (fraudType === fraud_case_entity_1.FraudType.INSIDER_TRADING)
            regulators.push('SEC');
        if (fraudType === fraud_case_entity_1.FraudType.MARKET_MANIPULATION)
            regulators.push('CFTC', 'FCA');
        return [...new Set(regulators)];
    }
};
exports.SuspiciousActivityService = SuspiciousActivityService;
__decorate([
    (0, schedule_1.Cron)('0 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuspiciousActivityService.prototype, "dailySarSweep", null);
__decorate([
    (0, schedule_1.Cron)('0 8 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuspiciousActivityService.prototype, "weeklyComplianceReport", null);
exports.SuspiciousActivityService = SuspiciousActivityService = SuspiciousActivityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fraud_case_entity_1.FraudCaseEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SuspiciousActivityService);
//# sourceMappingURL=suspicious-activity.service.js.map