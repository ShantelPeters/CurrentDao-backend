import { Repository } from 'typeorm';
import { FraudCaseEntity, FraudSeverity } from '../entities/fraud-case.entity';
import { PreTradeCheckDto, PreTradeCheckResult } from '../dto/fraud-alert.dto';
export interface BlockedTrader {
    traderId: string;
    reason: string;
    blockedAt: Date;
    expiresAt: Date | null;
    severity: FraudSeverity;
}
export declare class FraudPreventionService {
    private readonly fraudCaseRepository;
    private readonly logger;
    private readonly blockedTraders;
    private readonly whitelist;
    private stats;
    private readonly BLOCK_THRESHOLD;
    private readonly REVIEW_THRESHOLD;
    private readonly RATE_LIMIT_PER_MINUTE;
    private readonly traderRateCounts;
    constructor(fraudCaseRepository: Repository<FraudCaseEntity>);
    preTradeCheck(checkDto: PreTradeCheckDto, mlScore?: number): Promise<PreTradeCheckResult>;
    blockTrader(traderId: string, reason: string, severity: FraudSeverity, durationHours?: number): void;
    unblockTrader(traderId: string): boolean;
    isTraderBlocked(traderId: string): boolean;
    getBlockedTraders(): BlockedTrader[];
    addToWhitelist(traderId: string): void;
    removeFromWhitelist(traderId: string): void;
    getWhitelist(): string[];
    getPreventionStats(): object;
    applyPreventionForCase(fraudCase: FraudCaseEntity): Promise<void>;
    private checkRateLimit;
    private updateRateCount;
    private recordPrevention;
}
