import { FraudType, FraudSeverity, FraudCaseStatus } from '../entities/fraud-case.entity';
export { FraudType, FraudSeverity, FraudCaseStatus };
export declare class AnalyzeTradeDto {
    tradeId: string;
    traderId: string;
    counterpartyId?: string;
    market: string;
    assetType: string;
    quantity: number;
    price: number;
    tradeValue: number;
    side: 'buy' | 'sell';
    orderType: 'market' | 'limit' | 'stop';
    timeInForce?: 'GTC' | 'IOC' | 'FOK';
    tradeTimestamp?: string;
    metadata?: Record<string, unknown>;
}
export declare class AnalyzeTradesBatchDto {
    trades: AnalyzeTradeDto[];
}
export declare class PreTradeCheckDto {
    traderId: string;
    market: string;
    quantity: number;
    price: number;
    side: 'buy' | 'sell';
    counterpartyId?: string;
}
export declare class InvestigationUpdateDto {
    status: FraudCaseStatus;
    investigationNotes?: string;
    assignedTo?: string;
    falsePositiveReason?: string;
    resolvedBy?: string;
}
export declare class FraudReportQueryDto {
    fraudType?: FraudType;
    severity?: FraudSeverity;
    status?: FraudCaseStatus;
    traderId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    minMlScore?: number;
    regulatoryReported?: boolean;
}
export interface FraudAnalysisResult {
    caseId: string;
    tradeId: string;
    traderId: string;
    isSuspicious: boolean;
    mlScore: number;
    severity: FraudSeverity;
    fraudTypes: FraudType[];
    patternsMatched: PatternMatchResult[];
    evidence: EvidenceItem[];
    recommendedAction: string;
    processingTimeMs: number;
}
export interface PatternMatchResult {
    patternId: string;
    patternName: string;
    category: string;
    matched: boolean;
    confidence: number;
    evidence: string;
}
export interface EvidenceItem {
    type: string;
    description: string;
    value: unknown;
    timestamp: Date;
}
export interface PreTradeCheckResult {
    allowed: boolean;
    riskScore: number;
    reasons: string[];
    recommendedAction: 'allow' | 'block' | 'review';
}
export interface FraudMetrics {
    totalCases: number;
    openCases: number;
    resolvedCases: number;
    falsePositives: number;
    falsePositiveRate: number;
    detectionRate: number;
    preventedTrades: number;
    blockedValue: number;
    averageMlScore: number;
    casesByType: Record<string, number>;
    casesBySeverity: Record<string, number>;
    averageResolutionTimeHours: number;
}
