export declare class CompressionService {
    private readonly logger;
    compressAsset(buffer: Buffer, algorithm?: 'gzip' | 'brotli'): Promise<Buffer>;
}
