"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_entity_1 = require("./entities/location.entity");
const grid_zone_entity_1 = require("./entities/grid-zone.entity");
const distance_algorithm_1 = require("./algorithms/distance.algorithm");
const zone_mapping_algorithm_1 = require("./algorithms/zone-mapping.algorithm");
let LocationService = class LocationService {
    constructor(locationRepository, gridZoneRepository) {
        this.locationRepository = locationRepository;
        this.gridZoneRepository = gridZoneRepository;
    }
    async createLocation(locationData) {
        if (locationData.latitude && locationData.longitude) {
            this.validateCoordinates(locationData.latitude, locationData.longitude);
        }
        if (!locationData.gridZoneId && locationData.latitude && locationData.longitude) {
            const zoneMapping = await this.findZoneForCoordinate({
                latitude: locationData.latitude,
                longitude: locationData.longitude
            });
            if (zoneMapping.zone) {
                locationData.gridZoneId = zoneMapping.zone.id;
                locationData.regionalPriceMultiplier = zoneMapping.zone.basePriceMultiplier;
            }
        }
        const location = this.locationRepository.create(locationData);
        return this.locationRepository.save(location);
    }
    async updateLocation(id, updateData) {
        const location = await this.locationRepository.findOne({ where: { id } });
        if (!location) {
            throw new common_1.NotFoundException(`Location with ID ${id} not found`);
        }
        if (updateData.latitude && updateData.longitude) {
            this.validateCoordinates(updateData.latitude, updateData.longitude);
        }
        if ((updateData.latitude || updateData.longitude) &&
            (updateData.latitude !== location.latitude || updateData.longitude !== location.longitude)) {
            const zoneMapping = await this.findZoneForCoordinate({
                latitude: updateData.latitude || location.latitude,
                longitude: updateData.longitude || location.longitude
            });
            if (zoneMapping.zone) {
                updateData.gridZoneId = zoneMapping.zone.id;
                updateData.regionalPriceMultiplier = zoneMapping.zone.basePriceMultiplier;
            }
        }
        Object.assign(location, updateData);
        return this.locationRepository.save(location);
    }
    async getLocation(id) {
        const location = await this.locationRepository.findOne({
            where: { id },
            relations: ['gridZone']
        });
        if (!location) {
            throw new common_1.NotFoundException(`Location with ID ${id} not found`);
        }
        return location;
    }
    async searchLocations(searchDto) {
        const queryBuilder = this.locationRepository.createQueryBuilder('location')
            .leftJoinAndSelect('location.gridZone', 'gridZone');
        if (searchDto.gridZoneId) {
            queryBuilder.andWhere('location.gridZoneId = :gridZoneId', {
                gridZoneId: searchDto.gridZoneId
            });
        }
        if (searchDto.country) {
            queryBuilder.andWhere('location.country = :country', {
                country: searchDto.country
            });
        }
        if (searchDto.state) {
            queryBuilder.andWhere('location.state = :state', {
                state: searchDto.state
            });
        }
        if (searchDto.city) {
            queryBuilder.andWhere('location.city = :city', {
                city: searchDto.city
            });
        }
        if (searchDto.minPriceMultiplier !== undefined) {
            queryBuilder.andWhere('location.regionalPriceMultiplier >= :minPriceMultiplier', {
                minPriceMultiplier: searchDto.minPriceMultiplier
            });
        }
        if (searchDto.maxPriceMultiplier !== undefined) {
            queryBuilder.andWhere('location.regionalPriceMultiplier <= :maxPriceMultiplier', {
                maxPriceMultiplier: searchDto.maxPriceMultiplier
            });
        }
        if (searchDto.isPublic !== undefined) {
            queryBuilder.andWhere('location.isPublic = :isPublic', {
                isPublic: searchDto.isPublic
            });
        }
        if (searchDto.latitude && searchDto.longitude && searchDto.radiusKm) {
            const boundingBox = distance_algorithm_1.DistanceAlgorithm.getBoundingBox({ latitude: searchDto.latitude, longitude: searchDto.longitude }, searchDto.radiusKm);
            queryBuilder.andWhere('location.latitude BETWEEN :minLat AND :maxLat', {
                minLat: boundingBox.minLat,
                maxLat: boundingBox.maxLat
            }).andWhere('location.longitude BETWEEN :minLon AND :maxLon', {
                minLon: boundingBox.minLon,
                maxLon: boundingBox.maxLon
            });
        }
        const sortBy = searchDto.sortBy || 'distance';
        const sortOrder = searchDto.sortOrder || 'asc';
        if (sortBy === 'distance' && searchDto.latitude && searchDto.longitude) {
            const locations = await queryBuilder.getMany();
            const sortedLocations = this.sortByDistance(locations, { latitude: searchDto.latitude, longitude: searchDto.longitude }, sortOrder);
            return this.paginateResults(sortedLocations, searchDto.page, searchDto.limit);
        }
        else {
            queryBuilder.orderBy(`location.${sortBy}`, sortOrder.toUpperCase());
        }
        const page = searchDto.page || 1;
        const limit = searchDto.limit || 20;
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [locations, total] = await queryBuilder.getMany();
        return {
            locations,
            total,
            page,
            limit
        };
    }
    async generateHeatmapData(heatmapDto) {
        const resolution = heatmapDto.resolution || 50;
        const bounds = {
            minLat: heatmapDto.minLat || -90,
            maxLat: heatmapDto.maxLat || 90,
            minLon: heatmapDto.minLon || -180,
            maxLon: heatmapDto.maxLon || 180
        };
        const locations = await this.locationRepository.find({
            where: {
                latitude: (0, typeorm_2.Between)(bounds.minLat, bounds.maxLat),
                longitude: (0, typeorm_2.Between)(bounds.minLon, bounds.maxLon),
                isPublic: true
            }
        });
        const grid = Array(resolution).fill(0).map(() => Array(resolution).fill(0));
        locations.forEach(location => {
            const gridX = Math.floor(((location.longitude - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * resolution);
            const gridY = Math.floor(((location.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * resolution);
            if (gridX >= 0 && gridX < resolution && gridY >= 0 && gridY < resolution) {
                grid[gridY][gridX]++;
            }
        });
        return {
            grid,
            bounds,
            resolution,
            totalLocations: locations.length
        };
    }
    async findZoneForCoordinate(coordinate) {
        const gridZones = await this.gridZoneRepository.find({ where: { isActive: true } });
        return zone_mapping_algorithm_1.ZoneMappingAlgorithm.findZoneForCoordinate(coordinate, gridZones);
    }
    async calculateDistance(locationId1, locationId2, unit = 'km') {
        const [location1, location2] = await Promise.all([
            this.getLocation(locationId1),
            this.getLocation(locationId2)
        ]);
        return distance_algorithm_1.DistanceAlgorithm.calculateDistance({ latitude: location1.latitude, longitude: location1.longitude }, { latitude: location2.latitude, longitude: location2.longitude }, unit);
    }
    async getRegionalPriceMultiplier(locationId) {
        const location = await this.getLocation(locationId);
        return location.regionalPriceMultiplier;
    }
    async createGridZone(zoneData) {
        const zone = this.gridZoneRepository.create(zoneData);
        return this.gridZoneRepository.save(zone);
    }
    async getGridZones() {
        return this.gridZoneRepository.find({ where: { isActive: true } });
    }
    async updateGridZone(id, updateData) {
        const zone = await this.gridZoneRepository.findOne({ where: { id } });
        if (!zone) {
            throw new common_1.NotFoundException(`Grid zone with ID ${id} not found`);
        }
        Object.assign(zone, updateData);
        return this.gridZoneRepository.save(zone);
    }
    async deleteLocation(id) {
        const location = await this.getLocation(id);
        location.isPublic = false;
        await this.locationRepository.save(location);
    }
    validateCoordinates(latitude, longitude) {
        if (latitude < -90 || latitude > 90) {
            throw new common_1.BadRequestException('Latitude must be between -90 and 90');
        }
        if (longitude < -180 || longitude > 180) {
            throw new common_1.BadRequestException('Longitude must be between -180 and 180');
        }
    }
    sortByDistance(locations, centerPoint, sortOrder) {
        return locations.sort((a, b) => {
            const distanceA = distance_algorithm_1.DistanceAlgorithm.calculateDistance(centerPoint, { latitude: a.latitude, longitude: a.longitude }).distance;
            const distanceB = distance_algorithm_1.DistanceAlgorithm.calculateDistance(centerPoint, { latitude: b.latitude, longitude: b.longitude }).distance;
            return sortOrder === 'asc' ? distanceA - distanceB : distanceB - distanceA;
        });
    }
    paginateResults(locations, page = 1, limit = 20) {
        const total = locations.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedLocations = locations.slice(startIndex, endIndex);
        return {
            locations: paginatedLocations,
            total,
            page,
            limit
        };
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(1, (0, typeorm_1.InjectRepository)(grid_zone_entity_1.GridZone)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LocationService);
//# sourceMappingURL=location.service.js.map