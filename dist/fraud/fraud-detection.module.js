"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fraud_case_entity_1 = require("./entities/fraud-case.entity");
const fraud_ml_service_1 = require("./ml/fraud-ml.service");
const pattern_recognition_service_1 = require("./patterns/pattern-recognition.service");
const real_time_monitor_service_1 = require("./monitoring/real-time-monitor.service");
const suspicious_activity_service_1 = require("./reporting/suspicious-activity.service");
const fraud_prevention_service_1 = require("./prevention/fraud-prevention.service");
const fraud_detection_controller_1 = require("./fraud-detection.controller");
let FraudDetectionModule = class FraudDetectionModule {
};
exports.FraudDetectionModule = FraudDetectionModule;
exports.FraudDetectionModule = FraudDetectionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fraud_case_entity_1.FraudCaseEntity])],
        controllers: [fraud_detection_controller_1.FraudDetectionController],
        providers: [
            fraud_ml_service_1.FraudMlService,
            pattern_recognition_service_1.PatternRecognitionService,
            real_time_monitor_service_1.RealTimeMonitorService,
            suspicious_activity_service_1.SuspiciousActivityService,
            fraud_prevention_service_1.FraudPreventionService,
        ],
        exports: [
            fraud_ml_service_1.FraudMlService,
            pattern_recognition_service_1.PatternRecognitionService,
            real_time_monitor_service_1.RealTimeMonitorService,
            suspicious_activity_service_1.SuspiciousActivityService,
            fraud_prevention_service_1.FraudPreventionService,
        ],
    })
], FraudDetectionModule);
//# sourceMappingURL=fraud-detection.module.js.map