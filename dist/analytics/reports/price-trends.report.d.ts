import { Repository } from 'typeorm';
import { AnalyticsData, AggregationPeriod } from '../entities/analytics-data.entity';
import { ReportParamsDto } from '../dto/report-params.dto';
export interface PriceDataPoint {
    timestamp: Date;
    price: number;
    volume: number;
    high: number;
    low: number;
    open: number;
    close: number;
}
export interface TechnicalIndicator {
    name: string;
    values: number[];
    signals: ('BUY' | 'SELL' | 'HOLD')[];
}
export interface PriceTrendsReport {
    period: {
        start: Date;
        end: Date;
        aggregation: AggregationPeriod;
    };
    summary: {
        currentPrice: number;
        priceChange: number;
        priceChangePercent: number;
        volatility: number;
        averagePrice: number;
        highestPrice: number;
        lowestPrice: number;
        trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
    };
    data: PriceDataPoint[];
    technicalIndicators?: TechnicalIndicator[];
    comparativeAnalysis?: {
        region: string;
        averagePrice: number;
        priceChange: number;
        volatility: number;
    }[];
}
export declare class PriceTrendsReport {
    private analyticsRepository;
    constructor(analyticsRepository: Repository<AnalyticsData>);
    generateReport(params: ReportParamsDto): Promise<PriceTrendsReport>;
    private fetchPriceData;
    private calculateSummary;
    private generateTechnicalIndicators;
    private calculateSMA;
    private calculateEMA;
    private calculateRSI;
    private calculateMACD;
    private generateSMASignals;
    private generateEMASignals;
    private generateRSISignals;
    private generateMACDSignals;
    private getComparativeAnalysis;
    private calculateStandardDeviation;
}
