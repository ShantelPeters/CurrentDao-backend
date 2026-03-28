import { WebhookService } from './webhook.service';
import { CreateWebhookDto, UpdateWebhookDto, WebhookQueryDto, WebhookDeliveryQueryDto, TriggerWebhookDto } from './dto/webhook.dto';
import { Webhook } from './entities/webhook.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    create(createWebhookDto: CreateWebhookDto): Promise<Webhook>;
    findAll(query: WebhookQueryDto): Promise<{
        webhooks: Webhook[];
        total: number;
    }>;
    findOne(id: string): Promise<Webhook>;
    update(id: string, updateWebhookDto: UpdateWebhookDto): Promise<Webhook>;
    remove(id: string): Promise<void>;
    trigger(triggerDto: TriggerWebhookDto): Promise<void>;
    getDeliveries(id: string, query: WebhookDeliveryQueryDto): Promise<{
        deliveries: WebhookDelivery[];
        total: number;
    }>;
    getDeliveryStats(webhookId?: string): Promise<{
        total: number;
        success: number;
        failed: number;
        pending: number;
        successRate: number;
    }>;
    getAllDeliveries(query: WebhookDeliveryQueryDto): Promise<{
        deliveries: WebhookDelivery[];
        total: number;
    }>;
}
