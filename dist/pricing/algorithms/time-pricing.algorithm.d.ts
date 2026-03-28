export declare class TimePricingAlgorithm {
    private readonly logger;
    calculateTimeMultiplier(timestamp: number): number;
    private calculateHourlyMultiplier;
    private calculateDailyMultiplier;
    private calculateSeasonalMultiplier;
    isPeakHour(timestamp: number): boolean;
    isOffPeakHour(timestamp: number): boolean;
    calculateTimeBasedDemandForecast(timestamp: number, baseDemand: number): number;
    private getSeasonalDemandAdjustment;
    getPeakHoursForDay(timestamp: number): {
        start: number;
        end: number;
    }[];
    calculateDurationBasedMultiplier(startTimestamp: number, endTimestamp: number): number;
}
