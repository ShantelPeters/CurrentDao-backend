import { Repository } from 'typeorm';
import { FraudCaseEntity, FraudSeverity, FraudType } from '../entities/fraud-case.entity';
import { FraudReportQueryDto, InvestigationUpdateDto } from '../dto/fraud-alert.dto';
export interface SarReport {
    sarReference: string;
    generatedAt: Date;
    caseId: string;
    traderId: string;
    fraudType: FraudType;
    severity: FraudSeverity;
    summary: string;
    evidence: object[];
    tradeData: object;
    mlScore: number;
    patternsMatched: string[];
    reportingObligation: string;
    regulatoryBodies: string[];
}
export interface PaginatedCases {
    data: FraudCaseEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class SuspiciousActivityService {
    private readonly fraudCaseRepository;
    private readonly logger;
    constructor(fraudCaseRepository: Repository<FraudCaseEntity>);
    generateSAR(fraudCase: FraudCaseEntity): Promise<SarReport>;
    generateSARById(caseId: string): Promise<SarReport | null>;
    queryCases(queryDto: FraudReportQueryDto): Promise<PaginatedCases>;
    getCaseById(id: string): Promise<FraudCaseEntity | null>;
    getCaseByCaseId(caseId: string): Promise<FraudCaseEntity | null>;
    updateCase(id: string, update: InvestigationUpdateDto): Promise<FraudCaseEntity | null>;
    getCasesByTrader(traderId: string, page?: number, limit?: number): Promise<PaginatedCases>;
    getMetrics(): Promise<object>;
    dailySarSweep(): Promise<void>;
    weeklyComplianceReport(): Promise<void>;
    private buildSarSummary;
    private determineReportingObligation;
    private getApplicableRegulators;
}
