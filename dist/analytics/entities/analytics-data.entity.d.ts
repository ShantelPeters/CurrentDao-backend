export declare enum AnalyticsType {
    TRADING_VOLUME = "trading_volume",
    PRICE_TREND = "price_trend",
    USER_PERFORMANCE = "user_performance",
    MARKET_EFFICIENCY = "market_efficiency",
    GEOGRAPHIC_PATTERN = "geographic_pattern",
    RENEWABLE_ENERGY = "renewable_energy"
}
export declare enum AggregationPeriod {
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare class AnalyticsData {
    id: string;
    type: AnalyticsType;
    period: AggregationPeriod;
    timestamp: Date;
    userId?: string;
    gridZoneId?: string;
    country?: string;
    data: Record<string, any>;
    totalValue?: number;
    averageValue?: number;
    count?: number;
    percentage?: number;
    metadata?: {
        source: string;
        version: string;
        confidence: number;
        lastUpdated: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
