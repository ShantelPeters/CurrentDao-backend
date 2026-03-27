import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrossBorderModule } from './cross-border/cross-border.module';
import { CrossBorderTransaction } from './cross-border/entities/cross-border-transaction.entity';
import { RiskManagementModule } from './risk/risk-management.module';
import { RiskDataEntity } from './risk/entities/risk-data.entity';
import { WebhooksModule } from './webhooks/webhooks.module';
import { PricingModule } from './pricing/pricing.module';
import { Webhook } from './webhooks/entities/webhook.entity';
import { WebhookDelivery } from './webhooks/entities/webhook-delivery.entity';
import { PriceHistory } from './pricing/entities/price-history.entity';
import { LocationModule } from './location/location.module';
import { Location } from './location/entities/location.entity';
import { GridZone } from './location/entities/grid-zone.entity';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticsData } from './analytics/entities/analytics-data.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [CrossBorderTransaction, RiskDataEntity, Webhook, WebhookDelivery, PriceHistory, Location, GridZone, AnalyticsData],
      synchronize: true,
    }),
    CrossBorderModule,
    RiskManagementModule,
    WebhooksModule,
    PricingModule,
    LocationModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
