export interface LocationData {
    latitude: number;
    longitude: number;
    gridDistance: number;
    populationDensity: number;
    infrastructureQuality: number;
    localDemand: number;
}
export declare class LocationAdjustmentAlgorithm {
    private readonly logger;
    private readonly locationDatabase;
    calculateLocationMultiplier(location: string): number;
    private getLocationData;
    private calculateGridDistanceMultiplier;
    private calculatePopulationDensityMultiplier;
    private calculateInfrastructureMultiplier;
    private calculateLocalDemandMultiplier;
    calculateDistanceBasedMultiplier(location1: string, location2: string): number;
    private calculateDistance;
    private toRadians;
    addLocationData(location: string, data: LocationData): void;
}
