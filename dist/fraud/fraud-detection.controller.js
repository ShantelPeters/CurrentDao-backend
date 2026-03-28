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
exports.FraudDetectionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const real_time_monitor_service_1 = require("./monitoring/real-time-monitor.service");
const suspicious_activity_service_1 = require("./reporting/suspicious-activity.service");
const fraud_prevention_service_1 = require("./prevention/fraud-prevention.service");
const fraud_ml_service_1 = require("./ml/fraud-ml.service");
const pattern_recognition_service_1 = require("./patterns/pattern-recognition.service");
const fraud_alert_dto_1 = require("./dto/fraud-alert.dto");
const fraud_case_entity_1 = require("./entities/fraud-case.entity");
let FraudDetectionController = class FraudDetectionController {
    constructor(monitorService, reportingService, preventionService, mlService, patternService) {
        this.monitorService = monitorService;
        this.reportingService = reportingService;
        this.preventionService = preventionService;
        this.mlService = mlService;
        this.patternService = patternService;
    }
    async analyzeTrade(tradeDto) {
        return this.monitorService.analyzeIncomingTrade(tradeDto);
    }
    async preTradeCheck(checkDto) {
        const mlResult = await this.mlService.analyzeTrade({
            tradeId: `pre-check-${Date.now()}`,
            traderId: checkDto.traderId,
            counterpartyId: checkDto.counterpartyId,
            market: checkDto.market,
            assetType: 'unknown',
            quantity: checkDto.quantity,
            price: checkDto.price,
            tradeValue: checkDto.quantity * checkDto.price,
            side: checkDto.side,
            orderType: 'limit',
        });
        return this.preventionService.preTradeCheck(checkDto, mlResult.score);
    }
    async getCases(queryDto) {
        return this.reportingService.queryCases(queryDto);
    }
    async getCaseByCaseId(caseId) {
        return this.reportingService.getCaseByCaseId(caseId);
    }
    async getCasesByTrader(traderId, page = 1, limit = 20) {
        return this.reportingService.getCasesByTrader(traderId, Number(page), Number(limit));
    }
    async getCaseById(id) {
        return this.reportingService.getCaseById(id);
    }
    async getSarReports(queryDto) {
        return this.reportingService.queryCases({
            ...queryDto,
            regulatoryReported: true,
        });
    }
    async generateSar(caseId) {
        return this.reportingService.generateSARById(caseId);
    }
    async startMonitoring(traderId) {
        this.monitorService.startTraderMonitoring(traderId);
        return { message: 'Monitoring started', traderId };
    }
    async stopMonitoring(traderId) {
        this.monitorService.stopTraderMonitoring(traderId);
        return { message: 'Monitoring stopped', traderId };
    }
    async getMonitoringStatus() {
        return this.monitorService.getMonitoringStatus();
    }
    async blockTrader(traderId, reason, durationHours) {
        this.preventionService.blockTrader(traderId, reason, fraud_case_entity_1.FraudSeverity.HIGH, durationHours);
        return { message: 'Trader blocked', traderId };
    }
    async unblockTrader(traderId) {
        const removed = this.preventionService.unblockTrader(traderId);
        return { message: removed ? 'Trader unblocked' : 'Trader not found in blocklist', traderId };
    }
    async getBlockedTraders() {
        return this.preventionService.getBlockedTraders();
    }
    async addToWhitelist(traderId) {
        this.preventionService.addToWhitelist(traderId);
        return { message: 'Trader added to whitelist', traderId };
    }
    async removeFromWhitelist(traderId) {
        this.preventionService.removeFromWhitelist(traderId);
        return { message: 'Trader removed from whitelist', traderId };
    }
    async getMetrics() {
        const [caseMetrics, preventionStats, mlMetrics] = await Promise.all([
            this.reportingService.getMetrics(),
            Promise.resolve(this.preventionService.getPreventionStats()),
            Promise.resolve(this.mlService.getModelMetrics()),
        ]);
        return {
            lastUpdated: new Date(),
            cases: caseMetrics,
            prevention: preventionStats,
            ml: mlMetrics,
            monitoring: this.monitorService.getMonitoringStatus(),
        };
    }
    async getPatterns() {
        return {
            patterns: this.patternService.getAllPatternDefinitions(),
            total: this.patternService.getAllPatternDefinitions().length,
        };
    }
    async getMlMetrics() {
        return this.mlService.getModelMetrics();
    }
};
exports.FraudDetectionController = FraudDetectionController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze a trade for fraud indicators' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fraud analysis result returned' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid trade data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraud_alert_dto_1.AnalyzeTradeDto]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "analyzeTrade", null);
__decorate([
    (0, common_1.Post)('prevention/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Pre-trade fraud prevention check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prevention check result' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraud_alert_dto_1.PreTradeCheckDto]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "preTradeCheck", null);
__decorate([
    (0, common_1.Get)('cases'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fraud cases with optional filters (paginated)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated fraud cases' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraud_alert_dto_1.FraudReportQueryDto]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getCases", null);
__decorate([
    (0, common_1.Get)('cases/ref/:caseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a fraud case by human-readable case ID' }),
    (0, swagger_1.ApiParam)({ name: 'caseId', description: 'Case ID (e.g. FRAUD-20250328-ABCD1234)' }),
    __param(0, (0, common_1.Param)('caseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getCaseByCaseId", null);
__decorate([
    (0, common_1.Get)('cases/trader/:traderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fraud cases for a specific trader' }),
    (0, swagger_1.ApiParam)({ name: 'traderId', description: 'Trader ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    __param(0, (0, common_1.Param)('traderId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getCasesByTrader", null);
__decorate([
    (0, common_1.Get)('cases/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a fraud case by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Fraud case UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fraud case details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Case not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getCaseById", null);
__decorate([
    (0, common_1.Get)('reports/sar'),
    (0, swagger_1.ApiOperation)({ summary: 'Query Suspicious Activity Reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SAR report list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraud_alert_dto_1.FraudReportQueryDto]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getSarReports", null);
__decorate([
    (0, common_1.Post)('reports/sar/:caseId/generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Manually generate SAR for a specific case' }),
    (0, swagger_1.ApiParam)({ name: 'caseId', description: 'Case ID (FRAUD-XXXXXXXX-XXXXXXXX)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SAR generated successfully' }),
    __param(0, (0, common_1.Param)('caseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "generateSar", null);
__decorate([
    (0, common_1.Post)('monitoring/start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Start real-time monitoring for a trader' }),
    __param(0, (0, common_1.Body)('traderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "startMonitoring", null);
__decorate([
    (0, common_1.Post)('monitoring/stop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Stop real-time monitoring for a trader' }),
    __param(0, (0, common_1.Body)('traderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "stopMonitoring", null);
__decorate([
    (0, common_1.Get)('monitoring/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current monitoring status and active sessions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getMonitoringStatus", null);
__decorate([
    (0, common_1.Post)('prevention/block'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Manually block a trader' }),
    __param(0, (0, common_1.Body)('traderId')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Body)('durationHours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "blockTrader", null);
__decorate([
    (0, common_1.Post)('prevention/unblock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unblock a trader' }),
    __param(0, (0, common_1.Body)('traderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "unblockTrader", null);
__decorate([
    (0, common_1.Get)('prevention/blocked'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of all blocked traders' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getBlockedTraders", null);
__decorate([
    (0, common_1.Post)('prevention/whitelist/add'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Add a trader to the whitelist' }),
    __param(0, (0, common_1.Body)('traderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "addToWhitelist", null);
__decorate([
    (0, common_1.Post)('prevention/whitelist/remove'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a trader from the whitelist' }),
    __param(0, (0, common_1.Body)('traderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "removeFromWhitelist", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fraud detection system metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System metrics dashboard' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('patterns'),
    (0, swagger_1.ApiOperation)({ summary: 'Get catalogue of all 50+ registered fraud patterns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pattern definitions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getPatterns", null);
__decorate([
    (0, common_1.Get)('ml/metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ML model performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ML model metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FraudDetectionController.prototype, "getMlMetrics", null);
exports.FraudDetectionController = FraudDetectionController = __decorate([
    (0, swagger_1.ApiTags)('Fraud Detection'),
    (0, common_1.Controller)('fraud'),
    __metadata("design:paramtypes", [real_time_monitor_service_1.RealTimeMonitorService,
        suspicious_activity_service_1.SuspiciousActivityService,
        fraud_prevention_service_1.FraudPreventionService,
        fraud_ml_service_1.FraudMlService,
        pattern_recognition_service_1.PatternRecognitionService])
], FraudDetectionController);
//# sourceMappingURL=fraud-detection.controller.js.map