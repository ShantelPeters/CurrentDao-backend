export declare class DynamicPricingAlgorithm {
    private readonly logger;
    calculateBasePrice(supply: number, demand: number, basePrice?: number): number;
    private applySupplyDemandAdjustment;
    private calculateMarketBasedPrice;
    calculateVolatilityMultiplier(historicalPrices: number[]): number;
    applyPriceBounds(price: number, minPrice?: number, maxPrice?: number): number;
    calculateElasticityAdjustment(supply: number, demand: number): number;
}
