export declare class PriceHistory {
    id: string;
    basePrice: number;
    finalPrice: number;
    location: string;
    energyType: string;
    supply: number;
    demand: number;
    supplyDemandRatio: number;
    locationMultiplier: number;
    timeMultiplier: number;
    renewablePremium: number;
    predictedPrice: number;
    isPeakHour: boolean;
    isRenewable: boolean;
    predictionAccuracy: number;
    timestamp: Date;
    createdAt: Date;
}
