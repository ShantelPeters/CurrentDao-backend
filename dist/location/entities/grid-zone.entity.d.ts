export declare class GridZone {
    id: string;
    zoneCode: string;
    zoneName: string;
    country: string;
    boundaries: {
        type: 'Polygon' | 'MultiPolygon';
        coordinates: number[][][] | number[][][][];
    };
    basePriceMultiplier: number;
    renewableEnergyPercentage: number;
    averageDemand: number;
    peakDemand: number;
    gridOperator: {
        name: string;
        contact: string;
        website: string;
    };
    isActive: boolean;
    regulations: {
        maxTradeVolume: number;
        tradingHours: string;
        complianceRequirements: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}
