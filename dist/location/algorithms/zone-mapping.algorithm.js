"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneMappingAlgorithm = void 0;
const distance_algorithm_1 = require("./distance.algorithm");
class ZoneMappingAlgorithm {
    static findZoneForCoordinate(coordinate, gridZones) {
        let exactZone = null;
        let nearestZone = null;
        let minDistance = Infinity;
        for (const zone of gridZones) {
            if (this.isCoordinateInZone(coordinate, zone)) {
                exactZone = zone;
                break;
            }
            const centroid = this.calculateZoneCentroid(zone);
            const distance = distance_algorithm_1.DistanceAlgorithm.calculateDistance(coordinate, centroid, 'km').distance;
            if (distance < minDistance) {
                minDistance = distance;
                nearestZone = zone;
            }
        }
        return {
            zone: exactZone,
            isExactMatch: exactZone !== null,
            nearestZone: nearestZone || undefined,
            distanceToNearest: minDistance === Infinity ? undefined : minDistance
        };
    }
    static findZonesWithinRadius(coordinate, gridZones, radiusKm) {
        const zonesWithinRadius = [];
        for (const zone of gridZones) {
            const centroid = this.calculateZoneCentroid(zone);
            const distance = distance_algorithm_1.DistanceAlgorithm.calculateDistance(coordinate, centroid, 'km').distance;
            if (distance <= radiusKm) {
                zonesWithinRadius.push(zone);
            }
        }
        return zonesWithinRadius;
    }
    static calculateZoneCentroid(zone) {
        const coordinates = zone.boundaries.coordinates;
        if (zone.boundaries.type === 'Polygon') {
            return this.calculatePolygonCentroid(coordinates[0]);
        }
        else if (zone.boundaries.type === 'MultiPolygon') {
            return this.calculatePolygonCentroid(coordinates[0][0]);
        }
        throw new Error('Unsupported boundary type');
    }
    static calculateZoneArea(zone) {
        const coordinates = zone.boundaries.coordinates;
        let totalArea = 0;
        if (zone.boundaries.type === 'Polygon') {
            totalArea = this.calculatePolygonArea(coordinates[0]);
        }
        else if (zone.boundaries.type === 'MultiPolygon') {
            for (const polygon of coordinates) {
                totalArea += this.calculatePolygonArea(polygon[0]);
            }
        }
        return totalArea;
    }
    static isCoordinateInZone(coordinate, zone) {
        const coordinates = zone.boundaries.coordinates;
        if (zone.boundaries.type === 'Polygon') {
            return distance_algorithm_1.DistanceAlgorithm.isPointInPolygon(coordinate, coordinates[0]);
        }
        else if (zone.boundaries.type === 'MultiPolygon') {
            for (const polygon of coordinates) {
                if (distance_algorithm_1.DistanceAlgorithm.isPointInPolygon(coordinate, polygon[0])) {
                    return true;
                }
            }
        }
        return false;
    }
    static calculatePolygonCentroid(polygon) {
        let sumLat = 0;
        let sumLon = 0;
        const numPoints = polygon.length - 1;
        for (let i = 0; i < numPoints; i++) {
            sumLon += polygon[i][0];
            sumLat += polygon[i][1];
        }
        return {
            latitude: sumLat / numPoints,
            longitude: sumLon / numPoints
        };
    }
    static calculatePolygonArea(polygon) {
        let area = 0;
        const numPoints = polygon.length - 1;
        for (let i = 0; i < numPoints; i++) {
            const j = (i + 1) % numPoints;
            area += polygon[i][0] * polygon[j][1];
            area -= polygon[j][0] * polygon[i][1];
        }
        return Math.abs(area) / 2;
    }
    static getAdjacentZones(zone, allZones) {
        const adjacentZones = [];
        const zoneCentroid = this.calculateZoneCentroid(zone);
        for (const otherZone of allZones) {
            if (otherZone.id === zone.id)
                continue;
            const otherCentroid = this.calculateZoneCentroid(otherZone);
            const distance = distance_algorithm_1.DistanceAlgorithm.calculateDistance(zoneCentroid, otherCentroid, 'km').distance;
            if (distance <= 50) {
                if (this.doZonesShareBoundary(zone, otherZone)) {
                    adjacentZones.push(otherZone);
                }
            }
        }
        return adjacentZones;
    }
    static doZonesShareBoundary(zone1, zone2) {
        const centroid1 = this.calculateZoneCentroid(zone1);
        const centroid2 = this.calculateZoneCentroid(zone2);
        const distance = distance_algorithm_1.DistanceAlgorithm.calculateDistance(centroid1, centroid2, 'km').distance;
        return distance < 20;
    }
}
exports.ZoneMappingAlgorithm = ZoneMappingAlgorithm;
//# sourceMappingURL=zone-mapping.algorithm.js.map