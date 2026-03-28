"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const analytics_service_1 = require("./analytics.service");
const analytics_data_entity_1 = require("./entities/analytics-data.entity");
const trading_volume_report_1 = require("./reports/trading-volume.report");
const price_trends_report_1 = require("./reports/price-trends.report");
const user_performance_report_1 = require("./reports/user-performance.report");
const market_efficiency_report_1 = require("./reports/market-efficiency.report");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([analytics_data_entity_1.AnalyticsData])
        ],
        providers: [
            analytics_service_1.AnalyticsService,
            trading_volume_report_1.TradingVolumeReport,
            price_trends_report_1.PriceTrendsReport,
            user_performance_report_1.UserPerformanceReport,
            market_efficiency_report_1.MarketEfficiencyReport,
        ],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map