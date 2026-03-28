import { Repository } from 'typeorm';
import { AnalyticsData, AggregationPeriod } from '../entities/analytics-data.entity';
import { ReportParamsDto } from '../dto/report-params.dto';
export interface MarketEfficiencyMetrics {
    timestamp: Date;
    bidAskSpread: number;
    spreadPercent: number;
    volatility: number;
    liquidity: number;
    marketDepth: number;
    priceEfficiency: number;
    volumeWeightedAveragePrice: number;
    tradingVelocity: number;
    orderBookImbalance: number;
}
export interface MarketEfficiencyReport {
    period: {
        start: Date;
        end: Date;
        aggregation: AggregationPeriod;
    };
    summary: {
        averageSpread: number;
        averageVolatility: number;
        averageLiquidity: number;
        marketEfficiencyScore: number;
        priceDiscoveryEfficiency: number;
        informationAsymmetry: number;
    };
    metrics: MarketEfficiencyMetrics[];
    geographicComparison?: {
        country: string;
        efficiencyScore: number;
        spread: number;
        volatility: number;
        liquidity: number;
    }[];
    timeAnalysis?: {
        hour: number;
        efficiencyScore: number;
        volume: number;
        volatility: number;
    }[];
    recommendations: string[];
}
export declare class MarketEfficiencyReport {
    private analyticsRepository;
    constructor(analyticsRepository: Repository<AnalyticsData>);
    generateReport(params: ReportParamsDto): Promise<MarketEfficiencyReport>;
    private fetchMarketEfficiencyData;
    private calculateSummary;
    private calculatePriceDiscoveryEfficiency;
    private getGeographicComparison;
    private getTimeBasedAnalysis;
    private generateRecommendations;
    generateRealTimeMetrics(gridZoneId?: string, country?: string): Promise<MarketEfficiencyMetrics>;
}
