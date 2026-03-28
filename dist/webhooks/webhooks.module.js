"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const schedule_1 = require("@nestjs/schedule");
const webhook_service_1 = require("./webhook.service");
const webhook_controller_1 = require("./webhook.controller");
const webhook_entity_1 = require("./entities/webhook.entity");
const webhook_delivery_entity_1 = require("./entities/webhook-delivery.entity");
const hmac_auth_1 = require("./auth/hmac.auth");
const event_filter_1 = require("./filters/event.filter");
let WebhooksModule = class WebhooksModule {
};
exports.WebhooksModule = WebhooksModule;
exports.WebhooksModule = WebhooksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([webhook_entity_1.Webhook, webhook_delivery_entity_1.WebhookDelivery]),
            axios_1.HttpModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [webhook_controller_1.WebhookController],
        providers: [webhook_service_1.WebhookService, hmac_auth_1.HmacAuthService, event_filter_1.EventFilterService],
        exports: [webhook_service_1.WebhookService, hmac_auth_1.HmacAuthService, event_filter_1.EventFilterService],
    })
], WebhooksModule);
//# sourceMappingURL=webhooks.module.js.map