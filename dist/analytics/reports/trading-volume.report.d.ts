import { Repository } from 'typeorm';
import { AnalyticsData, AggregationPeriod } from '../entities/analytics-data.entity';
import { ReportParamsDto } from '../dto/report-params.dto';
export interface TradingVolumeData {
    timestamp: Date;
    volume: number;
    value: number;
    transactions: number;
    averageTransactionSize: number;
    period: AggregationPeriod;
}
export interface TradingVolumeReport {
    period: {
        start: Date;
        end: Date;
        aggregation: AggregationPeriod;
    };
    summary: {
        totalVolume: number;
        totalValue: number;
        totalTransactions: number;
        averageTransactionSize: number;
        peakVolume: number;
        peakVolumeTime: Date;
        growthRate: number;
    };
    data: TradingVolumeData[];
    geographicBreakdown?: {
        country: string;
        volume: number;
        value: number;
        percentage: number;
    }[];
    renewableEnergyBreakdown?: {
        renewableVolume: number;
        totalVolume: number;
        percentage: number;
    };
}
export declare class TradingVolumeReport {
    private analyticsRepository;
    constructor(analyticsRepository: Repository<AnalyticsData>);
    generateReport(params: ReportParamsDto): Promise<TradingVolumeReport>;
    private fetchTradingVolumeData;
    private calculateSummary;
    private getGeographicBreakdown;
    private getRenewableEnergyBreakdown;
    generateHourlyReport(params: ReportParamsDto): Promise<TradingVolumeReport>;
    generateDailyReport(params: ReportParamsDto): Promise<TradingVolumeReport>;
    generateWeeklyReport(params: ReportParamsDto): Promise<TradingVolumeReport>;
    generateMonthlyReport(params: ReportParamsDto): Promise<TradingVolumeReport>;
}
