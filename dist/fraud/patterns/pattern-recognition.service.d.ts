import { AnalyzeTradeDto, FraudType, PatternMatchResult } from '../dto/fraud-alert.dto';
interface PatternContext {
    recentTrades?: AnalyzeTradeDto[];
    traderHistory?: Record<string, unknown>;
}
export declare class PatternRecognitionService {
    private readonly logger;
    private readonly patterns;
    constructor();
    analyzePatterns(tradeDto: AnalyzeTradeDto, context?: PatternContext): PatternMatchResult[];
    getMatchedPatterns(tradeDto: AnalyzeTradeDto, context?: PatternContext): PatternMatchResult[];
    getAllPatternDefinitions(): object[];
    private registerPatterns;
    inferFraudTypes(patterns: PatternMatchResult[]): FraudType[];
}
export {};
