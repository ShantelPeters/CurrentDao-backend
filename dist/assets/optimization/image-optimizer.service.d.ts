export declare class ImageOptimizerService {
    private readonly logger;
    optimizeImage(buffer: Buffer, format?: 'webp' | 'jpeg' | 'png'): Promise<Buffer>;
}
