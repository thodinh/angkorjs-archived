function enumerable() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = true;
    };
}

function configurable() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = true;
    };
}

function readonly() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.writable = false;
    };
}

export {
    enumerable,
    configurable,
    readonly
};
