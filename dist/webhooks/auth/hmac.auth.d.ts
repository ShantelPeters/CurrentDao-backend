export declare class HmacAuthService {
    generateSignature(payload: string, secret: string): string;
    verifySignature(payload: string, signature: string, secret: string): boolean;
    generateTimestamp(): number;
    verifyTimestamp(timestamp: number, maxAgeSeconds?: number): boolean;
    signWebhook(payload: any, secret: string): {
        signature: string;
        timestamp: number;
    };
}
