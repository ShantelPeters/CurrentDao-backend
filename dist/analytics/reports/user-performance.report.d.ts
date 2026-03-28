import { Repository } from 'typeorm';
import { AnalyticsData, AggregationPeriod } from '../entities/analytics-data.entity';
import { ReportParamsDto } from '../dto/report-params.dto';
export interface UserPerformanceMetrics {
    userId: string;
    totalTrades: number;
    totalVolume: number;
    totalValue: number;
    profitLoss: number;
    profitLossPercent: number;
    winRate: number;
    averageTradeSize: number;
    averageProfitPerTrade: number;
    riskAdjustedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    tradingFrequency: number;
    renewableEnergyTrades: number;
    renewableEnergyPercentage: number;
}
export interface UserPerformanceReport {
    period: {
        start: Date;
        end: Date;
        aggregation: AggregationPeriod;
    };
    userMetrics: UserPerformanceMetrics;
    historicalData: {
        timestamp: Date;
        profitLoss: number;
        cumulativeValue: number;
        tradeCount: number;
    }[];
    leaderboard?: {
        rank: number;
        totalUsers: number;
        percentile: number;
    };
    performanceBreakdown?: {
        byGridZone: {
            zoneId: string;
            zoneName: string;
            profitLoss: number;
            tradeCount: number;
            winRate: number;
        }[];
        byEnergyType: {
            renewable: {
                profitLoss: number;
                tradeCount: number;
                percentage: number;
            };
            nonRenewable: {
                profitLoss: number;
                tradeCount: number;
                percentage: number;
            };
        };
    };
    recommendations: string[];
}
export declare class UserPerformanceReport {
    private analyticsRepository;
    constructor(analyticsRepository: Repository<AnalyticsData>);
    generateReport(params: ReportParamsDto): Promise<UserPerformanceReport>;
    private calculateUserMetrics;
    private calculateRiskMetrics;
    private calculateTradingFrequency;
    private getHistoricalPerformance;
    private getLeaderboardPosition;
    private getPerformanceBreakdown;
    private generateRecommendations;
}
