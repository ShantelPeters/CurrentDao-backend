import { Webhook } from './webhook.entity';
export declare enum DeliveryStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    RETRYING = "retrying"
}
export declare class WebhookDelivery {
    id: string;
    webhook: Webhook;
    webhookId: string;
    eventType: string;
    payload: Record<string, any>;
    status: DeliveryStatus;
    responseCode: number;
    responseBody: string;
    attemptNumber: number;
    nextRetryAt: Date;
    errorMessage: string;
    duration: number;
    createdAt: Date;
    deliveredAt: Date;
}
