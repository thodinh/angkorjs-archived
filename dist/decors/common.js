"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function enumerable() {
    return function (target, propertyKey, descriptor) {
        descriptor.enumerable = true;
    };
}
exports.enumerable = enumerable;
function configurable() {
    return function (target, propertyKey, descriptor) {
        descriptor.configurable = true;
    };
}
exports.configurable = configurable;
function readonly() {
    return function (target, propertyKey, descriptor) {
        descriptor.writable = false;
    };
}
exports.readonly = readonly;
//# sourceMappingURL=common.js.map