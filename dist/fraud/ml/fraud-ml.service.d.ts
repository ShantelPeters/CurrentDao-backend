import { Repository } from 'typeorm';
import { FraudCaseEntity } from '../entities/fraud-case.entity';
import { AnalyzeTradeDto, EvidenceItem, FraudSeverity } from '../dto/fraud-alert.dto';
interface MlFeatures {
    volumeAnomaly: number;
    frequencyAnomaly: number;
    priceImpactScore: number;
    orderToTradeRatio: number;
    roundTripScore: number;
    velocityScore: number;
    counterpartyConcentration: number;
    timePatternAnomaly: number;
    marketImpactScore: number;
    cancellationRate: number;
}
interface MlAnalysisResult {
    score: number;
    severity: FraudSeverity;
    features: MlFeatures;
    topContributors: string[];
    evidence: EvidenceItem[];
    processingTimeMs: number;
}
export declare class FraudMlService {
    private readonly fraudCaseRepository;
    private readonly logger;
    private readonly traderBaselines;
    private truePositives;
    private falsePositives;
    private modelVersion;
    private readonly VOLUME_ANOMALY_MULTIPLIER;
    private readonly FREQUENCY_ANOMALY_MULTIPLIER;
    private readonly HIGH_CANCELLATION_RATE;
    private readonly SUSPICIOUS_ROUND_TRIP_WINDOW_MS;
    private readonly MIN_TRADES_FOR_BASELINE;
    constructor(fraudCaseRepository: Repository<FraudCaseEntity>);
    analyzeTrade(tradeDto: AnalyzeTradeDto): Promise<MlAnalysisResult>;
    private extractFeatures;
    private computeVolumeAnomaly;
    private computeFrequencyAnomaly;
    private computePriceImpact;
    private computeOrderToTradeRatio;
    private computeRoundTripScore;
    private computeVelocityScore;
    private computeCounterpartyConcentration;
    private computeTimePatternAnomaly;
    private computeMarketImpact;
    private computeAnomalyScore;
    private scoreToSeverity;
    private getTopContributors;
    private buildEvidence;
    private getOrCreateBaseline;
    private updateBaseline;
    recordFeedback(caseId: string, wasTruePositive: boolean): void;
    getModelMetrics(): object;
}
export {};
