export declare class CacheService {
    private readonly logger;
    private readonly cache;
    set(key: string, value: any, ttlSeconds?: number): void;
    get(key: string): any | null;
    invalidate(key: string): void;
}
