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
exports.FraudReportQueryDto = exports.InvestigationUpdateDto = exports.PreTradeCheckDto = exports.AnalyzeTradesBatchDto = exports.AnalyzeTradeDto = exports.FraudCaseStatus = exports.FraudSeverity = exports.FraudType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const fraud_case_entity_1 = require("../entities/fraud-case.entity");
Object.defineProperty(exports, "FraudType", { enumerable: true, get: function () { return fraud_case_entity_1.FraudType; } });
Object.defineProperty(exports, "FraudSeverity", { enumerable: true, get: function () { return fraud_case_entity_1.FraudSeverity; } });
Object.defineProperty(exports, "FraudCaseStatus", { enumerable: true, get: function () { return fraud_case_entity_1.FraudCaseStatus; } });
class AnalyzeTradeDto {
}
exports.AnalyzeTradeDto = AnalyzeTradeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier of the trade' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "tradeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trader / account identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "traderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Counterparty identifier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "counterpartyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Energy market identifier (e.g., EU-ETS, PJM)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "market", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset type (e.g., electricity, gas, carbon_credit)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trade quantity in MWh or equivalent' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], AnalyzeTradeDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trade price per unit' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], AnalyzeTradeDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total trade value in USD' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], AnalyzeTradeDto.prototype, "tradeValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order side: buy or sell' }),
    (0, class_validator_1.IsEnum)(['buy', 'sell']),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "side", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order type: market, limit, stop' }),
    (0, class_validator_1.IsEnum)(['market', 'limit', 'stop']),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "orderType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Time-in-force: GTC, IOC, FOK' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['GTC', 'IOC', 'FOK']),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "timeInForce", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp of the trade (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyzeTradeDto.prototype, "tradeTimestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional trade metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AnalyzeTradeDto.prototype, "metadata", void 0);
class AnalyzeTradesBatchDto {
}
exports.AnalyzeTradesBatchDto = AnalyzeTradesBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AnalyzeTradeDto], description: 'Array of trades to analyze' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AnalyzeTradesBatchDto.prototype, "trades", void 0);
class PreTradeCheckDto {
}
exports.PreTradeCheckDto = PreTradeCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreTradeCheckDto.prototype, "traderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreTradeCheckDto.prototype, "market", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PreTradeCheckDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PreTradeCheckDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(['buy', 'sell']),
    __metadata("design:type", String)
], PreTradeCheckDto.prototype, "side", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreTradeCheckDto.prototype, "counterpartyId", void 0);
class InvestigationUpdateDto {
}
exports.InvestigationUpdateDto = InvestigationUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: fraud_case_entity_1.FraudCaseStatus }),
    (0, class_validator_1.IsEnum)(fraud_case_entity_1.FraudCaseStatus),
    __metadata("design:type", String)
], InvestigationUpdateDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Investigator notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], InvestigationUpdateDto.prototype, "investigationNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned investigator ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvestigationUpdateDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason if marking as false positive' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], InvestigationUpdateDto.prototype, "falsePositiveReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolved by (user ID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvestigationUpdateDto.prototype, "resolvedBy", void 0);
class FraudReportQueryDto {
}
exports.FraudReportQueryDto = FraudReportQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: fraud_case_entity_1.FraudType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(fraud_case_entity_1.FraudType),
    __metadata("design:type", String)
], FraudReportQueryDto.prototype, "fraudType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: fraud_case_entity_1.FraudSeverity }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(fraud_case_entity_1.FraudSeverity),
    __metadata("design:type", String)
], FraudReportQueryDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: fraud_case_entity_1.FraudCaseStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(fraud_case_entity_1.FraudCaseStatus),
    __metadata("design:type", String)
], FraudReportQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by trader ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FraudReportQueryDto.prototype, "traderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FraudReportQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FraudReportQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FraudReportQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FraudReportQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum ML score filter (0-1)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], FraudReportQueryDto.prototype, "minMlScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter regulatory reported only' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FraudReportQueryDto.prototype, "regulatoryReported", void 0);
//# sourceMappingURL=fraud-alert.dto.js.map