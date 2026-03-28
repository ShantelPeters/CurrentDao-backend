import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Webhook } from './entities/webhook.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
import { HmacAuthService } from './auth/hmac.auth';
import { EventFilterService } from './filters/event.filter';
import { CreateWebhookDto, UpdateWebhookDto, TriggerWebhookDto } from './dto/webhook.dto';
export declare class WebhookService {
    private webhookRepository;
    private deliveryRepository;
    private hmacAuthService;
    private eventFilterService;
    private httpService;
    private readonly logger;
    constructor(webhookRepository: Repository<Webhook>, deliveryRepository: Repository<WebhookDelivery>, hmacAuthService: HmacAuthService, eventFilterService: EventFilterService, httpService: HttpService);
    create(createWebhookDto: CreateWebhookDto): Promise<Webhook>;
    findAll(page?: number, limit?: number): Promise<{
        webhooks: Webhook[];
        total: number;
    }>;
    findOne(id: string): Promise<Webhook>;
    update(id: string, updateWebhookDto: UpdateWebhookDto): Promise<Webhook>;
    remove(id: string): Promise<void>;
    triggerWebhook(triggerDto: TriggerWebhookDto): Promise<void>;
    private shouldTriggerWebhook;
    private queueWebhookDelivery;
    private processWebhookDelivery;
    private handleFailedDelivery;
    private calculateBackoffDelay;
    retryFailedDeliveries(): Promise<void>;
    getDeliveryStats(webhookId?: string): Promise<{
        total: number;
        success: number;
        failed: number;
        pending: number;
        successRate: number;
    }>;
    getDeliveries(page?: number, limit?: number, webhookId?: string): Promise<{
        deliveries: WebhookDelivery[];
        total: number;
    }>;
}
