"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceAlgorithm = void 0;
class DistanceAlgorithm {
    static calculateDistance(point1, point2, unit = 'km') {
        const lat1Rad = this.toRadians(point1.latitude);
        const lat2Rad = this.toRadians(point2.latitude);
        const deltaLatRad = this.toRadians(point2.latitude - point1.latitude);
        const deltaLonRad = this.toRadians(point2.longitude - point1.longitude);
        const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const radius = unit === 'km' ? this.EARTH_RADIUS_KM : this.EARTH_RADIUS_MILES;
        const distance = radius * c;
        return {
            distance: Math.round(distance * 100) / 100,
            unit,
            bearing: this.calculateBearing(point1, point2)
        };
    }
    static calculateBearing(point1, point2) {
        const lat1Rad = this.toRadians(point1.latitude);
        const lat2Rad = this.toRadians(point2.latitude);
        const deltaLonRad = this.toRadians(point2.longitude - point1.longitude);
        const y = Math.sin(deltaLonRad) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad);
        const bearing = Math.atan2(y, x);
        return (this.toDegrees(bearing) + 360) % 360;
    }
    static findPointsWithinRadius(centerPoint, points, radiusKm) {
        return points.filter(point => {
            const distance = this.calculateDistance(centerPoint, point, 'km').distance;
            return distance <= radiusKm;
        });
    }
    static getBoundingBox(centerPoint, radiusKm) {
        const deltaLat = radiusKm / this.EARTH_RADIUS_KM * (180 / Math.PI);
        const deltaLon = Math.asin(radiusKm / this.EARTH_RADIUS_KM) * (180 / Math.PI) /
            Math.cos(this.toRadians(centerPoint.latitude));
        return {
            minLat: centerPoint.latitude - deltaLat,
            maxLat: centerPoint.latitude + deltaLat,
            minLon: centerPoint.longitude - deltaLon,
            maxLon: centerPoint.longitude + deltaLon
        };
    }
    static isPointInPolygon(point, polygon) {
        let inside = false;
        const x = point.longitude;
        const y = point.latitude;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    static toDegrees(radians) {
        return radians * (180 / Math.PI);
    }
}
exports.DistanceAlgorithm = DistanceAlgorithm;
DistanceAlgorithm.EARTH_RADIUS_KM = 6371;
DistanceAlgorithm.EARTH_RADIUS_MILES = 3959;
//# sourceMappingURL=distance.algorithm.js.map