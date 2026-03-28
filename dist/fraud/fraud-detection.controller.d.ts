import { RealTimeMonitorService } from './monitoring/real-time-monitor.service';
import { SuspiciousActivityService } from './reporting/suspicious-activity.service';
import { FraudPreventionService } from './prevention/fraud-prevention.service';
import { FraudMlService } from './ml/fraud-ml.service';
import { PatternRecognitionService } from './patterns/pattern-recognition.service';
import { AnalyzeTradeDto, PreTradeCheckDto, FraudReportQueryDto } from './dto/fraud-alert.dto';
export declare class FraudDetectionController {
    private readonly monitorService;
    private readonly reportingService;
    private readonly preventionService;
    private readonly mlService;
    private readonly patternService;
    constructor(monitorService: RealTimeMonitorService, reportingService: SuspiciousActivityService, preventionService: FraudPreventionService, mlService: FraudMlService, patternService: PatternRecognitionService);
    analyzeTrade(tradeDto: AnalyzeTradeDto): Promise<import("./dto/fraud-alert.dto").FraudAnalysisResult>;
    preTradeCheck(checkDto: PreTradeCheckDto): Promise<import("./dto/fraud-alert.dto").PreTradeCheckResult>;
    getCases(queryDto: FraudReportQueryDto): Promise<import("./reporting/suspicious-activity.service").PaginatedCases>;
    getCaseByCaseId(caseId: string): Promise<import("./entities/fraud-case.entity").FraudCaseEntity>;
    getCasesByTrader(traderId: string, page?: number, limit?: number): Promise<import("./reporting/suspicious-activity.service").PaginatedCases>;
    getCaseById(id: string): Promise<import("./entities/fraud-case.entity").FraudCaseEntity>;
    getSarReports(queryDto: FraudReportQueryDto): Promise<import("./reporting/suspicious-activity.service").PaginatedCases>;
    generateSar(caseId: string): Promise<import("./reporting/suspicious-activity.service").SarReport>;
    startMonitoring(traderId: string): Promise<{
        message: string;
        traderId: string;
    }>;
    stopMonitoring(traderId: string): Promise<{
        message: string;
        traderId: string;
    }>;
    getMonitoringStatus(): Promise<object>;
    blockTrader(traderId: string, reason: string, durationHours?: number): Promise<{
        message: string;
        traderId: string;
    }>;
    unblockTrader(traderId: string): Promise<{
        message: string;
        traderId: string;
    }>;
    getBlockedTraders(): Promise<import("./prevention/fraud-prevention.service").BlockedTrader[]>;
    addToWhitelist(traderId: string): Promise<{
        message: string;
        traderId: string;
    }>;
    removeFromWhitelist(traderId: string): Promise<{
        message: string;
        traderId: string;
    }>;
    getMetrics(): Promise<{
        lastUpdated: Date;
        cases: object;
        prevention: object;
        ml: object;
        monitoring: object;
    }>;
    getPatterns(): Promise<{
        patterns: object[];
        total: number;
    }>;
    getMlMetrics(): Promise<object>;
}
