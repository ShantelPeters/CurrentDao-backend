export declare class CreateWebhookDto {
    url: string;
    secret: string;
    events: string[];
    active?: boolean;
    maxRetries?: number;
    timeoutMs?: number;
    filters?: Record<string, any>;
}
export declare class UpdateWebhookDto {
    url?: string;
    secret?: string;
    events?: string[];
    active?: boolean;
    maxRetries?: number;
    timeoutMs?: number;
    filters?: Record<string, any>;
}
export declare class WebhookQueryDto {
    eventType?: string;
    active?: boolean;
    url?: string;
    page?: number;
    limit?: number;
}
export declare class WebhookDeliveryQueryDto {
    webhookId?: string;
    status?: string;
    eventType?: string;
    page?: number;
    limit?: number;
}
export declare class TriggerWebhookDto {
    eventType: string;
    data: Record<string, any>;
    transactionId?: string;
    timestamp?: number;
}
