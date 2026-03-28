import { PriceHistory } from '../entities/price-history.entity';
export declare class PredictionAlgorithm {
    private readonly logger;
    predictPrice(historicalData: PriceHistory[], hoursAhead: number, currentSupply?: number, currentDemand?: number): {
        predictedPrice: number;
        confidence: number;
        factors: any;
    };
    private calculateTrendPrediction;
    private calculateSeasonalPrediction;
    private calculateVolatilityPrediction;
    private calculateSupplyDemandPrediction;
    private calculateLinearTrend;
    calculatePredictionAccuracy(predictions: Array<{
        predicted: number;
        actual: number;
    }>): number;
}
