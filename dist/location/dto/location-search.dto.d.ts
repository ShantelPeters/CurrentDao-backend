export declare enum LocationSearchSortBy {
    DISTANCE = "distance",
    PRICE = "price",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt"
}
export declare enum LocationSearchSortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class LocationSearchDto {
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    gridZoneId?: string;
    country?: string;
    state?: string;
    city?: string;
    minPriceMultiplier?: number;
    maxPriceMultiplier?: number;
    isPublic?: boolean;
    sortBy?: LocationSearchSortBy;
    sortOrder?: LocationSearchSortOrder;
    page?: number;
    limit?: number;
}
export declare class LocationHeatmapDto {
    minLat?: number;
    maxLat?: number;
    minLon?: number;
    maxLon?: number;
    resolution?: number;
}
