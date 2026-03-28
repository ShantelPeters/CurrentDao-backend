import { PricingService } from './pricing.service';
import { CalculatePriceDto, PriceHistoryQueryDto, PricePredictionDto } from './dto/calculate-price.dto';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
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
    predictPrice(predictionDto: PricePredictionDto): Promise<{
        predictedPrice: number;
        confidence: number;
        factors: any;
    }>;
    getPriceHistory(query: PriceHistoryQueryDto): Promise<{
        history: import("./entities/price-history.entity").PriceHistory[];
        total: number;
        averagePrice: number;
        minPrice: number;
        maxPrice: number;
    }>;
    getAnalytics(location?: string, energyType?: string): Promise<{
        totalTransactions: number;
        averagePrice: number;
        priceVolatility: number;
        peakHourAverage: number;
        offPeakHourAverage: number;
        renewablePremium: number;
        predictionAccuracy: number;
    }>;
}
