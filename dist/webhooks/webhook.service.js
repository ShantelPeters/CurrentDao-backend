"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("@nestjs/axios");
const webhook_entity_1 = require("./entities/webhook.entity");
const webhook_delivery_entity_1 = require("./entities/webhook-delivery.entity");
const hmac_auth_1 = require("./auth/hmac.auth");
const event_filter_1 = require("./filters/event.filter");
const rxjs_1 = require("rxjs");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(webhookRepository, deliveryRepository, hmacAuthService, eventFilterService, httpService) {
        this.webhookRepository = webhookRepository;
        this.deliveryRepository = deliveryRepository;
        this.hmacAuthService = hmacAuthService;
        this.eventFilterService = eventFilterService;
        this.httpService = httpService;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    async create(createWebhookDto) {
        const webhook = this.webhookRepository.create(createWebhookDto);
        return this.webhookRepository.save(webhook);
    }
    async findAll(page = 1, limit = 10) {
        const [webhooks, total] = await this.webhookRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { webhooks, total };
    }
    async findOne(id) {
        return this.webhookRepository.findOne({
            where: { id },
            relations: ['deliveries'],
        });
    }
    async update(id, updateWebhookDto) {
        await this.webhookRepository.update(id, updateWebhookDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.webhookRepository.delete(id);
    }
    async triggerWebhook(triggerDto) {
        const activeWebhooks = await this.webhookRepository.find({
            where: { active: true },
        });
        for (const webhook of activeWebhooks) {
            if (this.shouldTriggerWebhook(webhook, triggerDto)) {
                await this.queueWebhookDelivery(webhook, triggerDto);
            }
        }
    }
    shouldTriggerWebhook(webhook, triggerDto) {
        if (!webhook.events.includes(triggerDto.eventType)) {
            return false;
        }
        return this.eventFilterService.matchesFilters(triggerDto.data, webhook.filters || {});
    }
    async queueWebhookDelivery(webhook, triggerDto) {
        const delivery = this.deliveryRepository.create({
            webhookId: webhook.id,
            webhook,
            eventType: triggerDto.eventType,
            payload: triggerDto.data,
            status: webhook_delivery_entity_1.DeliveryStatus.PENDING,
            attemptNumber: 0,
        });
        await this.deliveryRepository.save(delivery);
        setImmediate(() => this.processWebhookDelivery(delivery.id));
    }
    async processWebhookDelivery(deliveryId) {
        const delivery = await this.deliveryRepository.findOne({
            where: { id: deliveryId },
            relations: ['webhook'],
        });
        if (!delivery) {
            this.logger.warn(`Delivery ${deliveryId} not found`);
            return;
        }
        const startTime = Date.now();
        try {
            const { signature, timestamp } = this.hmacAuthService.signWebhook(delivery.payload, delivery.webhook.secret);
            const payload = {
                id: delivery.id,
                eventType: delivery.eventType,
                timestamp,
                data: delivery.payload,
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(delivery.webhook.url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': signature,
                    'X-Webhook-Timestamp': timestamp.toString(),
                    'User-Agent': 'CurrentDao-Webhook/1.0',
                },
                timeout: delivery.webhook.timeoutMs,
            }));
            const duration = Date.now() - startTime;
            await this.deliveryRepository.update(deliveryId, {
                status: webhook_delivery_entity_1.DeliveryStatus.SUCCESS,
                responseCode: response.status,
                responseBody: JSON.stringify(response.data),
                duration,
                deliveredAt: new Date(),
            });
            await this.webhookRepository.increment({ id: delivery.webhookId }, 'deliveryCount', 1);
            this.logger.log(`Webhook delivered successfully: ${deliveryId} to ${delivery.webhook.url}`);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            await this.handleFailedDelivery(delivery, error, duration);
        }
    }
    async handleFailedDelivery(delivery, error, duration) {
        const attemptNumber = delivery.attemptNumber + 1;
        const maxRetries = delivery.webhook.maxRetries;
        if (attemptNumber > maxRetries) {
            await this.deliveryRepository.update(delivery.id, {
                status: webhook_delivery_entity_1.DeliveryStatus.FAILED,
                attemptNumber,
                errorMessage: error.message,
                duration,
            });
            await this.webhookRepository.increment({ id: delivery.webhookId }, 'failureCount', 1);
            this.logger.error(`Webhook delivery failed permanently: ${delivery.id}`, error);
            return;
        }
        const nextRetryAt = new Date(Date.now() + this.calculateBackoffDelay(attemptNumber));
        await this.deliveryRepository.update(delivery.id, {
            status: webhook_delivery_entity_1.DeliveryStatus.RETRYING,
            attemptNumber,
            nextRetryAt,
            errorMessage: error.message,
            duration,
        });
        this.logger.warn(`Webhook delivery failed, scheduling retry: ${delivery.id} in ${this.calculateBackoffDelay(attemptNumber)}ms`);
    }
    calculateBackoffDelay(attemptNumber) {
        const baseDelay = 1000;
        const maxDelay = 300000;
        const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
        const jitter = Math.random() * 1000;
        return Math.min(exponentialDelay + jitter, maxDelay);
    }
    async retryFailedDeliveries() {
        const pendingRetries = await this.deliveryRepository.find({
            where: {
                status: webhook_delivery_entity_1.DeliveryStatus.RETRYING,
                nextRetryAt: (0, typeorm_2.LessThan)(new Date()),
            },
            relations: ['webhook'],
        });
        for (const delivery of pendingRetries) {
            setImmediate(() => this.processWebhookDelivery(delivery.id));
        }
    }
    async getDeliveryStats(webhookId) {
        const whereClause = webhookId ? { webhookId } : {};
        const [total, success, failed, pending] = await Promise.all([
            this.deliveryRepository.count({ where: whereClause }),
            this.deliveryRepository.count({ where: { ...whereClause, status: webhook_delivery_entity_1.DeliveryStatus.SUCCESS } }),
            this.deliveryRepository.count({ where: { ...whereClause, status: webhook_delivery_entity_1.DeliveryStatus.FAILED } }),
            this.deliveryRepository.count({ where: { ...whereClause, status: webhook_delivery_entity_1.DeliveryStatus.PENDING } }),
        ]);
        const successRate = total > 0 ? (success / total) * 100 : 0;
        return { total, success, failed, pending, successRate };
    }
    async getDeliveries(page = 1, limit = 10, webhookId) {
        const whereClause = webhookId ? { webhookId } : {};
        const [deliveries, total] = await this.deliveryRepository.findAndCount({
            where: whereClause,
            relations: ['webhook'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { deliveries, total };
    }
};
exports.WebhookService = WebhookService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebhookService.prototype, "retryFailedDeliveries", null);
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(webhook_entity_1.Webhook)),
    __param(1, (0, typeorm_1.InjectRepository)(webhook_delivery_entity_1.WebhookDelivery)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        hmac_auth_1.HmacAuthService,
        event_filter_1.EventFilterService,
        axios_1.HttpService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map