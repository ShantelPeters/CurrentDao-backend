"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LocationAdjustmentAlgorithm_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationAdjustmentAlgorithm = void 0;
const common_1 = require("@nestjs/common");
let LocationAdjustmentAlgorithm = LocationAdjustmentAlgorithm_1 = class LocationAdjustmentAlgorithm {
    constructor() {
        this.logger = new common_1.Logger(LocationAdjustmentAlgorithm_1.class.name);
        this.locationDatabase = new Map([
            {
                key: 'new-york',
                value: {
                    latitude: 40.7128,
                    longitude: -74.0060,
                    gridDistance: 50,
                    populationDensity: 10000,
                    infrastructureQuality: 0.9,
                    localDemand: 1000
                }
            },
            {
                key: 'london',
                value: {
                    latitude: 51.5074,
                    longitude: -0.1278,
                    gridDistance: 30,
                    populationDensity: 5700,
                    infrastructureQuality: 0.85,
                    localDemand: 800
                }
            },
            {
                key: 'tokyo',
                value: {
                    latitude: 35.6762,
                    longitude: 139.6503,
                    gridDistance: 20,
                    populationDensity: 15000,
                    infrastructureQuality: 0.95,
                    localDemand: 1200
                }
            },
            {
                key: 'berlin',
                value: {
                    latitude: 52.5200,
                    longitude: 13.4050,
                    gridDistance: 40,
                    populationDensity: 4000,
                    infrastructureQuality: 0.8,
                    localDemand: 600
                }
            },
            {
                key: 'paris',
                value: {
                    latitude: 48.8566,
                    longitude: 2.3522,
                    gridDistance: 35,
                    populationDensity: 21000,
                    infrastructureQuality: 0.88,
                    localDemand: 900
                }
            }
        ]);
    }
    calculateLocationMultiplier(location) {
        const locationData = this.getLocationData(location);
        if (!locationData) {
            this.logger.warn(`Location data not found for ${location}, using default multiplier`);
            return 1.0;
        }
        const gridDistanceMultiplier = this.calculateGridDistanceMultiplier(locationData.gridDistance);
        const populationDensityMultiplier = this.calculatePopulationDensityMultiplier(locationData.populationDensity);
        const infrastructureMultiplier = this.calculateInfrastructureMultiplier(locationData.infrastructureQuality);
        const demandMultiplier = this.calculateLocalDemandMultiplier(locationData.localDemand);
        const finalMultiplier = gridDistanceMultiplier * populationDensityMultiplier *
            infrastructureMultiplier * demandMultiplier;
        return Math.round(finalMultiplier * 100) / 100;
    }
    getLocationData(location) {
        const normalizedLocation = location.toLowerCase().replace(/[\s_-]/g, '-');
        return this.locationDatabase.get(normalizedLocation);
    }
    calculateGridDistanceMultiplier(distance) {
        if (distance <= 20)
            return 0.9;
        if (distance <= 40)
            return 1.0;
        if (distance <= 60)
            return 1.1;
        if (distance <= 80)
            return 1.2;
        return 1.3;
    }
    calculatePopulationDensityMultiplier(density) {
        if (density >= 15000)
            return 1.3;
        if (density >= 10000)
            return 1.2;
        if (density >= 5000)
            return 1.1;
        if (density >= 2000)
            return 1.0;
        return 0.9;
    }
    calculateInfrastructureMultiplier(quality) {
        return 2.0 - quality;
    }
    calculateLocalDemandMultiplier(demand) {
        if (demand >= 1000)
            return 1.15;
        if (demand >= 800)
            return 1.1;
        if (demand >= 600)
            return 1.05;
        if (demand >= 400)
            return 1.0;
        return 0.95;
    }
    calculateDistanceBasedMultiplier(location1, location2) {
        const data1 = this.getLocationData(location1);
        const data2 = this.getLocationData(location2);
        if (!data1 || !data2) {
            return 1.0;
        }
        const distance = this.calculateDistance(data1, data2);
        if (distance <= 100)
            return 1.0;
        if (distance <= 500)
            return 1.05;
        if (distance <= 1000)
            return 1.1;
        if (distance <= 2000)
            return 1.2;
        return 1.3;
    }
    calculateDistance(loc1, loc2) {
        const R = 6371;
        const dLat = this.toRadians(loc2.latitude - loc1.latitude);
        const dLon = this.toRadians(loc2.longitude - loc1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(loc1.latitude)) * Math.cos(this.toRadians(loc2.latitude)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    addLocationData(location, data) {
        const normalizedLocation = location.toLowerCase().replace(/[\s_-]/g, '-');
        this.locationDatabase.set(normalizedLocation, data);
    }
};
exports.LocationAdjustmentAlgorithm = LocationAdjustmentAlgorithm;
exports.LocationAdjustmentAlgorithm = LocationAdjustmentAlgorithm = LocationAdjustmentAlgorithm_1 = __decorate([
    (0, common_1.Injectable)()
], LocationAdjustmentAlgorithm);
//# sourceMappingURL=location-adjustment.algorithm.js.map