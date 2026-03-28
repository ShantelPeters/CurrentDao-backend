import { WebhookDelivery } from './webhook-delivery.entity';
export declare class Webhook {
    id: string;
    url: string;
    secret: string;
    events: string[];
    active: boolean;
    maxRetries: number;
    timeoutMs: number;
    filters: Record<string, any>;
    deliveryCount: number;
    failureCount: number;
    createdAt: Date;
    updatedAt: Date;
    deliveries: WebhookDelivery[];
}
