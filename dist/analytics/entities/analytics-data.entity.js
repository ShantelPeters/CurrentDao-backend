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
exports.AnalyticsData = exports.AggregationPeriod = exports.AnalyticsType = void 0;
const typeorm_1 = require("typeorm");
var AnalyticsType;
(function (AnalyticsType) {
    AnalyticsType["TRADING_VOLUME"] = "trading_volume";
    AnalyticsType["PRICE_TREND"] = "price_trend";
    AnalyticsType["USER_PERFORMANCE"] = "user_performance";
    AnalyticsType["MARKET_EFFICIENCY"] = "market_efficiency";
    AnalyticsType["GEOGRAPHIC_PATTERN"] = "geographic_pattern";
    AnalyticsType["RENEWABLE_ENERGY"] = "renewable_energy";
})(AnalyticsType || (exports.AnalyticsType = AnalyticsType = {}));
var AggregationPeriod;
(function (AggregationPeriod) {
    AggregationPeriod["HOURLY"] = "hourly";
    AggregationPeriod["DAILY"] = "daily";
    AggregationPeriod["WEEKLY"] = "weekly";
    AggregationPeriod["MONTHLY"] = "monthly";
    AggregationPeriod["QUARTERLY"] = "quarterly";
    AggregationPeriod["YEARLY"] = "yearly";
})(AggregationPeriod || (exports.AggregationPeriod = AggregationPeriod = {}));
let AnalyticsData = class AnalyticsData {
};
exports.AnalyticsData = AnalyticsData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AnalyticsData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AnalyticsType
    }),
    __metadata("design:type", String)
], AnalyticsData.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AggregationPeriod
    }),
    __metadata("design:type", String)
], AnalyticsData.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AnalyticsData.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AnalyticsData.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AnalyticsData.prototype, "gridZoneId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AnalyticsData.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], AnalyticsData.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AnalyticsData.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AnalyticsData.prototype, "averageValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AnalyticsData.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AnalyticsData.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AnalyticsData.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AnalyticsData.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AnalyticsData.prototype, "updatedAt", void 0);
exports.AnalyticsData = AnalyticsData = __decorate([
    (0, typeorm_1.Entity)('analytics_data'),
    (0, typeorm_1.Index)(['type', 'period', 'timestamp']),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['gridZoneId'])
], AnalyticsData);
//# sourceMappingURL=analytics-data.entity.js.map