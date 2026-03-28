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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudCaseEntity = exports.FraudCaseStatus = exports.FraudSeverity = exports.FraudType = void 0;
const typeorm_1 = require("typeorm");
var FraudType;
(function (FraudType) {
    FraudType["WASH_TRADING"] = "wash_trading";
    FraudType["SPOOFING"] = "spoofing";
    FraudType["LAYERING"] = "layering";
    FraudType["MARKET_MANIPULATION"] = "market_manipulation";
    FraudType["FRONT_RUNNING"] = "front_running";
    FraudType["PUMP_AND_DUMP"] = "pump_and_dump";
    FraudType["CROSS_MARKET_MANIPULATION"] = "cross_market_manipulation";
    FraudType["INSIDER_TRADING"] = "insider_trading";
    FraudType["MOMENTUM_IGNITION"] = "momentum_ignition";
    FraudType["PAINTING_THE_TAPE"] = "painting_the_tape";
    FraudType["RAMPING"] = "ramping";
    FraudType["BANGING_THE_CLOSE"] = "banging_the_close";
    FraudType["CIRCULAR_TRADING"] = "circular_trading";
    FraudType["ORDER_BOOK_SPOOFING"] = "order_book_spoofing";
    FraudType["VELOCITY_ABUSE"] = "velocity_abuse";
    FraudType["UNKNOWN"] = "unknown";
})(FraudType || (exports.FraudType = FraudType = {}));
var FraudSeverity;
(function (FraudSeverity) {
    FraudSeverity["LOW"] = "low";
    FraudSeverity["MEDIUM"] = "medium";
    FraudSeverity["HIGH"] = "high";
    FraudSeverity["CRITICAL"] = "critical";
})(FraudSeverity || (exports.FraudSeverity = FraudSeverity = {}));
var FraudCaseStatus;
(function (FraudCaseStatus) {
    FraudCaseStatus["OPEN"] = "open";
    FraudCaseStatus["INVESTIGATING"] = "investigating";
    FraudCaseStatus["RESOLVED"] = "resolved";
    FraudCaseStatus["FALSE_POSITIVE"] = "false_positive";
    FraudCaseStatus["ESCALATED"] = "escalated";
    FraudCaseStatus["REGULATORY_REPORTED"] = "regulatory_reported";
})(FraudCaseStatus || (exports.FraudCaseStatus = FraudCaseStatus = {}));
let FraudCaseEntity = class FraudCaseEntity {
};
exports.FraudCaseEntity = FraudCaseEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'case_id', unique: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "caseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trade_id', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "tradeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trader_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "traderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'counterparty_id', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "counterpartyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fraud_type',
        type: 'enum',
        enum: FraudType,
        default: FraudType.UNKNOWN,
    }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "fraudType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'severity',
        type: 'enum',
        enum: FraudSeverity,
        default: FraudSeverity.LOW,
    }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: FraudCaseStatus,
        default: FraudCaseStatus.OPEN,
    }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'ml_score',
        type: 'decimal',
        precision: 5,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], FraudCaseEntity.prototype, "mlScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pattern_matched', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "patternMatched", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patterns_triggered', type: 'json', default: '[]' }),
    __metadata("design:type", Array)
], FraudCaseEntity.prototype, "patternsTriggered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'evidence', type: 'json', default: '[]' }),
    __metadata("design:type", Array)
], FraudCaseEntity.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trade_data', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], FraudCaseEntity.prototype, "tradeData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ml_features', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], FraudCaseEntity.prototype, "mlFeatures", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'regulatory_reported',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], FraudCaseEntity.prototype, "regulatoryReported", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'prevention_applied',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], FraudCaseEntity.prototype, "preventionApplied", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prevention_action', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "preventionAction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_to', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'investigation_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "investigationNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'false_positive_reason',
        nullable: true,
    }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "falsePositiveReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_by', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "resolvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_at', nullable: true }),
    __metadata("design:type", Date)
], FraudCaseEntity.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sar_reference', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "sarReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'market', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "market", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_type', nullable: true }),
    __metadata("design:type", String)
], FraudCaseEntity.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'trade_value',
        type: 'decimal',
        precision: 20,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], FraudCaseEntity.prototype, "tradeValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FraudCaseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FraudCaseEntity.prototype, "updatedAt", void 0);
exports.FraudCaseEntity = FraudCaseEntity = __decorate([
    (0, typeorm_1.Entity)('fraud_cases'),
    (0, typeorm_1.Index)(['traderId', 'createdAt']),
    (0, typeorm_1.Index)(['status', 'severity'])
], FraudCaseEntity);
//# sourceMappingURL=fraud-case.entity.js.map