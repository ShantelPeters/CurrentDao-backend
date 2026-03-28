import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { GridZone } from './entities/grid-zone.entity';
import { LocationSearchDto, LocationHeatmapDto } from './dto/location-search.dto';
import { Coordinates } from './algorithms/distance.algorithm';
export declare class LocationService {
    private locationRepository;
    private gridZoneRepository;
    constructor(locationRepository: Repository<Location>, gridZoneRepository: Repository<GridZone>);
    createLocation(locationData: Partial<Location>): Promise<Location>;
    updateLocation(id: string, updateData: Partial<Location>): Promise<Location>;
    getLocation(id: string): Promise<Location>;
    searchLocations(searchDto: LocationSearchDto): Promise<{
        locations: Location[];
        total: number;
        page: number;
        limit: number;
    }>;
    generateHeatmapData(heatmapDto: LocationHeatmapDto): Promise<{
        grid: number[][];
        bounds: {
            minLat: number;
            maxLat: number;
            minLon: number;
            maxLon: number;
        };
        resolution: number;
        totalLocations: number;
    }>;
    findZoneForCoordinate(coordinate: Coordinates): Promise<import("./algorithms/zone-mapping.algorithm").ZoneMappingResult>;
    calculateDistance(locationId1: string, locationId2: string, unit?: 'km' | 'miles'): Promise<import("./algorithms/distance.algorithm").DistanceResult>;
    getRegionalPriceMultiplier(locationId: string): Promise<number>;
    createGridZone(zoneData: Partial<GridZone>): Promise<GridZone>;
    getGridZones(): Promise<GridZone[]>;
    updateGridZone(id: string, updateData: Partial<GridZone>): Promise<GridZone>;
    deleteLocation(id: string): Promise<void>;
    private validateCoordinates;
    private sortByDistance;
    private paginateResults;
}
