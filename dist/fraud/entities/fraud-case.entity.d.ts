export declare enum FraudType {
    WASH_TRADING = "wash_trading",
    SPOOFING = "spoofing",
    LAYERING = "layering",
    MARKET_MANIPULATION = "market_manipulation",
    FRONT_RUNNING = "front_running",
    PUMP_AND_DUMP = "pump_and_dump",
    CROSS_MARKET_MANIPULATION = "cross_market_manipulation",
    INSIDER_TRADING = "insider_trading",
    MOMENTUM_IGNITION = "momentum_ignition",
    PAINTING_THE_TAPE = "painting_the_tape",
    RAMPING = "ramping",
    BANGING_THE_CLOSE = "banging_the_close",
    CIRCULAR_TRADING = "circular_trading",
    ORDER_BOOK_SPOOFING = "order_book_spoofing",
    VELOCITY_ABUSE = "velocity_abuse",
    UNKNOWN = "unknown"
}
export declare enum FraudSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum FraudCaseStatus {
    OPEN = "open",
    INVESTIGATING = "investigating",
    RESOLVED = "resolved",
    FALSE_POSITIVE = "false_positive",
    ESCALATED = "escalated",
    REGULATORY_REPORTED = "regulatory_reported"
}
export declare class FraudCaseEntity {
    id: string;
    caseId: string;
    tradeId: string;
    traderId: string;
    counterpartyId: string;
    fraudType: FraudType;
    severity: FraudSeverity;
    status: FraudCaseStatus;
    mlScore: number;
    patternMatched: string;
    patternsTriggered: string[];
    evidence: object[];
    tradeData: object;
    mlFeatures: object;
    regulatoryReported: boolean;
    preventionApplied: boolean;
    preventionAction: string | null;
    assignedTo: string;
    investigationNotes: string;
    falsePositiveReason: string;
    resolvedBy: string;
    resolvedAt: Date;
    sarReference: string;
    market: string;
    assetType: string;
    tradeValue: number;
    createdAt: Date;
    updatedAt: Date;
}
