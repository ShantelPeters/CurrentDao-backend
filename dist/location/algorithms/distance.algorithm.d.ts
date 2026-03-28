export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface DistanceResult {
    distance: number;
    unit: 'km' | 'miles';
    bearing?: number;
}
export declare class DistanceAlgorithm {
    private static readonly EARTH_RADIUS_KM;
    private static readonly EARTH_RADIUS_MILES;
    static calculateDistance(point1: Coordinates, point2: Coordinates, unit?: 'km' | 'miles'): DistanceResult;
    static calculateBearing(point1: Coordinates, point2: Coordinates): number;
    static findPointsWithinRadius<T extends Coordinates>(centerPoint: Coordinates, points: T[], radiusKm: number): T[];
    static getBoundingBox(centerPoint: Coordinates, radiusKm: number): {
        minLat: number;
        maxLat: number;
        minLon: number;
        maxLon: number;
    };
    static isPointInPolygon(point: Coordinates, polygon: number[][]): boolean;
    private static toRadians;
    private static toDegrees;
}
