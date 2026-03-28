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
exports.DashboardMetricsDto = exports.ReportParamsDto = exports.ReportFormat = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const analytics_data_entity_1 = require("../entities/analytics-data.entity");
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["JSON"] = "json";
    ReportFormat["CSV"] = "csv";
    ReportFormat["PDF"] = "pdf";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
class ReportParamsDto {
    constructor() {
        this.format = ReportFormat.JSON;
        this.includeTechnicalIndicators = true;
        this.includeComparativeAnalysis = true;
        this.topPerformersCount = 10;
        this.realTime = false;
    }
}
exports.ReportParamsDto = ReportParamsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of analytics report',
        enum: analytics_data_entity_1.AnalyticsType
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(analytics_data_entity_1.AnalyticsType),
    __metadata("design:type", String)
], ReportParamsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Aggregation period for the data',
        enum: analytics_data_entity_1.AggregationPeriod
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(analytics_data_entity_1.AggregationPeriod),
    __metadata("design:type", String)
], ReportParamsDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for the report period',
        type: Date,
        example: '2024-01-01'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ReportParamsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for the report period',
        type: Date,
        example: '2024-12-31'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ReportParamsDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID to filter data for specific user',
        example: 'user-123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportParamsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grid zone ID to filter data for specific zone',
        example: 'zone-456'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportParamsDto.prototype, "gridZoneId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country to filter data',
        example: 'United States'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportParamsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Report output format',
        enum: ReportFormat,
        default: ReportFormat.JSON
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ReportFormat),
    __metadata("design:type", String)
], ReportParamsDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include technical indicators in price trend reports',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportParamsDto.prototype, "includeTechnicalIndicators", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include comparative analysis',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportParamsDto.prototype, "includeComparativeAnalysis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of top performers to include in leaderboards',
        example: 10,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ReportParamsDto.prototype, "topPerformersCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable real-time data refresh',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportParamsDto.prototype, "realTime", void 0);
class DashboardMetricsDto {
    constructor() {
        this.timeWindowHours = 24;
        this.includeGeographicBreakdown = true;
        this.includeRenewableMetrics = true;
        this.includeMarketEfficiency = true;
    }
}
exports.DashboardMetricsDto = DashboardMetricsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time window for dashboard metrics (in hours)',
        example: 24,
        minimum: 1,
        maximum: 8760
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(8760),
    __metadata("design:type", Number)
], DashboardMetricsDto.prototype, "timeWindowHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include geographic breakdown',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DashboardMetricsDto.prototype, "includeGeographicBreakdown", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include renewable energy metrics',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DashboardMetricsDto.prototype, "includeRenewableMetrics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include market efficiency indicators',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DashboardMetricsDto.prototype, "includeMarketEfficiency", void 0);
//# sourceMappingURL=report-params.dto.js.map