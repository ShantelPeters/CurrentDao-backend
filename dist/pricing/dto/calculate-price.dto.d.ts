export declare enum EnergyType {
    SOLAR = "solar",
    WIND = "wind",
    HYDRO = "hydro",
    NUCLEAR = "nuclear",
    FOSSIL = "fossil",
    GEOTHERMAL = "geothermal"
}
export declare class CalculatePriceDto {
    supply: number;
    demand: number;
    location: string;
    energyType: EnergyType;
    timestamp?: number;
    basePrice?: number;
    includePrediction?: boolean;
    predictionHorizonHours?: number;
}
export declare class PriceHistoryQueryDto {
    location?: string;
    energyType?: EnergyType;
    startDate?: number;
    endDate?: number;
    page?: number;
    limit?: number;
}
export declare class PricePredictionDto {
    location: string;
    energyType: EnergyType;
    hoursAhead: number;
    expectedSupply?: number;
    expectedDemand?: number;
}
