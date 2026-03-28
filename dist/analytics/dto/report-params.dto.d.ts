import { AnalyticsType, AggregationPeriod } from '../entities/analytics-data.entity';
export declare enum ReportFormat {
    JSON = "json",
    CSV = "csv",
    PDF = "pdf"
}
export declare class ReportParamsDto {
    type?: AnalyticsType;
    period?: AggregationPeriod;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    gridZoneId?: string;
    country?: string;
    format?: ReportFormat;
    includeTechnicalIndicators?: boolean;
    includeComparativeAnalysis?: boolean;
    topPerformersCount?: number;
    realTime?: boolean;
}
export declare class DashboardMetricsDto {
    timeWindowHours?: number;
    includeGeographicBreakdown?: boolean;
    includeRenewableMetrics?: boolean;
    includeMarketEfficiency?: boolean;
}
