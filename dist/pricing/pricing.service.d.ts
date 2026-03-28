import { Repository } from 'typeorm';
import { PriceHistory } from './entities/price-history.entity';
import { CalculatePriceDto, PriceHistoryQueryDto, PricePredictionDto } from './dto/calculate-price.dto';
import { DynamicPricingAlgorithm } from './algorithms/dynamic-pricing.algorithm';
import { LocationAdjustmentAlgorithm } from './algorithms/location-adjustment.algorithm';
import { TimePricingAlgorithm } from './algorithms/time-pricing.algorithm';
import { PredictionAlgorithm } from './algorithms/prediction.algorithm';
export declare class PricingService {
    private priceHistoryRepository;
    private dynamicPricingAlgorithm;
    private locationAdjustmentAlgorithm;
    private timePricingAlgorithm;
    private predictionAlgorithm;
    private readonly logger;
    constructor(priceHistoryRepository: Repository<PriceHistory>, dynamicPricingAlgorithm: DynamicPricingAlgorithm, locationAdjustmentAlgorithm: LocationAdjustmentAlgorithm, timePricingAlgorithm: TimePricingAlgorithm, predictionAlgorithm: PredictionAlgorithm);
    calculatePrice(calculatePriceDto: CalculatePriceDto): Promise<{
        basePrice: number;
        finalPrice: number;
        locationMultiplier: number;
        timeMultiplier: number;
        renewablePremium: number;
        supplyDemandRatio: number;
        isPeakHour: boolean;
        predictedPrice?: number;
        predictionAccuracy?: number;
    }>;
    private calculateRenewablePremium;
    private isRenewableEnergy;
    predictPrice(predictionDto: PricePredictionDto): Promise<{
        predictedPrice: number;
        confidence: number;
        factors: any;
    }>;
    getPriceHistory(query: PriceHistoryQueryDto): Promise<{
        history: PriceHistory[];
        total: number;
        averagePrice: number;
        minPrice: number;
        maxPrice: number;
    }>;
    private getHistoricalData;
    private savePriceHistory;
    getPricingAnalytics(location?: string, energyType?: string): Promise<{
        totalTransactions: number;
        averagePrice: number;
        priceVolatility: number;
        peakHourAverage: number;
        offPeakHourAverage: number;
        renewablePremium: number;
        predictionAccuracy: number;
    }>;
    cleanupOldData(): Promise<void>;
}
