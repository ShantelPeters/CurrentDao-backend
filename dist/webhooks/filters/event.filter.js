"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventFilterService = void 0;
const common_1 = require("@nestjs/common");
let EventFilterService = class EventFilterService {
    matchesFilters(event, filters) {
        if (!filters || Object.keys(filters).length === 0) {
            return true;
        }
        for (const [key, filterValue] of Object.entries(filters)) {
            if (!this.matchesFilter(event[key], filterValue)) {
                return false;
            }
        }
        return true;
    }
    matchesFilter(eventValue, filterValue) {
        if (Array.isArray(filterValue)) {
            return filterValue.includes(eventValue);
        }
        if (typeof filterValue === 'object' && filterValue !== null) {
            return this.matchesObjectFilter(eventValue, filterValue);
        }
        return eventValue === filterValue;
    }
    matchesObjectFilter(eventValue, filterObject) {
        if (typeof eventValue !== 'object' || eventValue === null) {
            return false;
        }
        for (const [key, value] of Object.entries(filterObject)) {
            if (key === '$gt' && eventValue <= value)
                return false;
            if (key === '$gte' && eventValue < value)
                return false;
            if (key === '$lt' && eventValue >= value)
                return false;
            if (key === '$lte' && eventValue > value)
                return false;
            if (key === '$ne' && eventValue === value)
                return false;
            if (key === '$in' && !Array.isArray(value))
                return false;
            if (key === '$in' && !value.includes(eventValue))
                return false;
            if (key === '$nin' && !Array.isArray(value))
                return false;
            if (key === '$nin' && value.includes(eventValue))
                return false;
            if (key === '$exists' && (value ? !eventValue : !!eventValue))
                return false;
            if (key === '$regex' && typeof eventValue === 'string') {
                const regex = new RegExp(value);
                if (!regex.test(eventValue))
                    return false;
            }
        }
        return true;
    }
    filterByEventType(events, eventTypes) {
        return eventTypes.length === 0 || events.some(event => eventTypes.includes(event));
    }
    filterByTimeRange(timestamp, startTime, endTime) {
        if (startTime && timestamp < startTime)
            return false;
        if (endTime && timestamp > endTime)
            return false;
        return true;
    }
    filterByAmount(amount, minAmount, maxAmount) {
        if (minAmount !== undefined && amount < minAmount)
            return false;
        if (maxAmount !== undefined && amount > maxAmount)
            return false;
        return true;
    }
};
exports.EventFilterService = EventFilterService;
exports.EventFilterService = EventFilterService = __decorate([
    (0, common_1.Injectable)()
], EventFilterService);
//# sourceMappingURL=event.filter.js.map