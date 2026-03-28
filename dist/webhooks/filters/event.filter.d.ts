export declare class EventFilterService {
    matchesFilters(event: any, filters: Record<string, any>): boolean;
    private matchesFilter;
    private matchesObjectFilter;
    filterByEventType(events: string[], eventTypes: string[]): boolean;
    filterByTimeRange(timestamp: number, startTime?: number, endTime?: number): boolean;
    filterByAmount(amount: number, minAmount?: number, maxAmount?: number): boolean;
}
