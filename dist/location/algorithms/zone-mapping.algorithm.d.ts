import { Coordinates } from './distance.algorithm';
import { GridZone } from '../entities/grid-zone.entity';
export interface ZoneMappingResult {
    zone: GridZone | null;
    isExactMatch: boolean;
    nearestZone?: GridZone;
    distanceToNearest?: number;
}
export declare class ZoneMappingAlgorithm {
    static findZoneForCoordinate(coordinate: Coordinates, gridZones: GridZone[]): ZoneMappingResult;
    static findZonesWithinRadius(coordinate: Coordinates, gridZones: GridZone[], radiusKm: number): GridZone[];
    static calculateZoneCentroid(zone: GridZone): Coordinates;
    static calculateZoneArea(zone: GridZone): number;
    private static isCoordinateInZone;
    private static calculatePolygonCentroid;
    private static calculatePolygonArea;
    static getAdjacentZones(zone: GridZone, allZones: GridZone[]): GridZone[];
    private static doZonesShareBoundary;
}
