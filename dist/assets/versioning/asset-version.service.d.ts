export declare class AssetVersionService {
    private readonly logger;
    generateVersionHash(buffer: Buffer): string;
    appendVersionToFilename(filename: string, hash: string): string;
}
