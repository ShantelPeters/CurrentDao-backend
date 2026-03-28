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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookDelivery = exports.DeliveryStatus = void 0;
const typeorm_1 = require("typeorm");
const webhook_entity_1 = require("./webhook.entity");
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "pending";
    DeliveryStatus["SUCCESS"] = "success";
    DeliveryStatus["FAILED"] = "failed";
    DeliveryStatus["RETRYING"] = "retrying";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
let WebhookDelivery = class WebhookDelivery {
};
exports.WebhookDelivery = WebhookDelivery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => webhook_entity_1.Webhook, webhook => webhook.deliveries),
    (0, typeorm_1.JoinColumn)({ name: 'webhook_id' }),
    __metadata("design:type", webhook_entity_1.Webhook)
], WebhookDelivery.prototype, "webhook", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'webhook_id' }),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "webhookId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Object)
], WebhookDelivery.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DeliveryStatus,
        default: DeliveryStatus.PENDING
    }),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], WebhookDelivery.prototype, "responseCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "responseBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], WebhookDelivery.prototype, "attemptNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], WebhookDelivery.prototype, "nextRetryAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], WebhookDelivery.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WebhookDelivery.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], WebhookDelivery.prototype, "deliveredAt", void 0);
exports.WebhookDelivery = WebhookDelivery = __decorate([
    (0, typeorm_1.Entity)('webhook_deliveries')
], WebhookDelivery);
//# sourceMappingURL=webhook-delivery.entity.js.map