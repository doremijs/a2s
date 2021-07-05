"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mockjs_1 = require("mockjs");
/**
 * 根据json schema生成mock数据
 */
function mockFromSchema(schema) {
    return generateOne(schema);
}
exports.default = mockFromSchema;
function commonMockWithArgs(mockFunc, schema) {
    if (schema.mockArgs !== undefined) {
        return mockjs_1.Random[mockFunc].apply(mockjs_1.Random, schema.mockArgs);
    }
    if (schema.minimum !== undefined && schema.minimum !== null) {
        if (schema.maximum !== undefined && schema.maximum !== null) {
            return mockjs_1.Random[mockFunc](schema.minimum, schema.maximum);
        }
        return mockjs_1.Random[mockFunc](schema.minimum);
    }
    return mockjs_1.Random[mockFunc]();
}
function generateOne(schema) {
    var _a, _b, _c, _d, _e;
    if (!schema.type) {
        return mockjs_1.Random.string(undefined, 4, 8);
    }
    var type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
    switch (type) {
        case 'integer':
        case 'number':
            return commonMockWithArgs((_a = schema.format) !== null && _a !== void 0 ? _a : 'integer', schema);
        case 'boolean':
            return commonMockWithArgs('boolean', schema);
        case 'string':
            return commonMockWithArgs((_b = schema.format) !== null && _b !== void 0 ? _b : 'string', schema);
        case 'array':
            return Array.from({ length: getRandomNumInRange((_c = schema.minItems) !== null && _c !== void 0 ? _c : 2, (_d = schema.maxItems) !== null && _d !== void 0 ? _d : 10) }, function () {
                return generateOne(Array.isArray(schema.items) ? schema.items[0] : schema.items);
            });
        case 'object':
            return Object.keys((_e = schema.properties) !== null && _e !== void 0 ? _e : {}).reduce(function (obj, key) {
                obj[key] = generateOne(schema.properties[key]);
                return obj;
            }, {});
        default:
            return null;
    }
}
function getRandomNumInRange(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
//# sourceMappingURL=index.js.map