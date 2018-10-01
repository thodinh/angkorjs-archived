import { enumerable, configurable, readonly } from "../decors/common";
import "reflect-metadata";
import * as Parse from "parse";
import * as _ from "underscore";
let classMap = {};
/**
 * Refer to explain: 
 *  - https://stackoverflow.com/questions/3911690/strange-javascript-idiom-what-does-xyz-testfunctionxyz-do
 *  - https://stackoverflow.com/questions/5924796/xyz-testfunctionxyz-b-super-b?noredirect=1&lq=1
 * 
 * Check what is Function.prototype.toString() return to
 * Becasue some JS platform will function body 
 * or return a string like this "[object Function]" or something else
 */
let fnTest = /xyz/.test(function(){ 'xyz()';}.toString()) ? /\b_super\b/ : /.*/;
let hasCalledSuper = (prop) => fnTest.test(prop);
export interface ModelMeta {
    className: string;
    extendClass?: string;
    inherit?: string;
    inherits?: any;
}

export interface MethodMeta {
    override?: boolean;
    extend?: string;
}

export interface FieldMeta {
    override?: boolean;
    extend?: string;
}

export function Model(meta: ModelMeta) {
    let { className, extendClass, inherit, inherits } = meta;
    let model = (target) => {
        let basedClass = classMap[className];
        if (basedClass) {
            let _super = basedClass.prototype;
            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            // initializing = true;
            let prototype = new basedClass();
            // initializing = false;
            let targetProp = target.prototype;
            // tslint:disable-next-line:forin
            for (let name in targetProp) {
                // Check if we're overwriting an existing function
                if (_.isFunction(targetProp[name]) && hasCalledSuper(targetProp[name])) {
                        prototype[name] = 
                            (function(_name, fn) {
                                return function() {
                                    let tmp = this._super;

                                    // Add a new ._super() method that is the same method
                                    // but on the super-class
                                    this._super = _super[_name];

                                    // The method only need to be bound temporarily, so we
                                    // remove it when we're done executing
                                    let ret = fn.apply(this, arguments);
                                    this._super = tmp;
                                    return ret;
                                };
                            })(name, targetProp[name])
                } else {
                    prototype[name] = targetProp[name];
                }
            }
            basedClass.prototype = prototype;
            basedClass.constructor = basedClass;
        } else {
            basedClass = target;
        }
        basedClass.prototype.className = className;
        classMap[className] = basedClass;
        Parse.Object.registerSubclass(className, basedClass);
        return basedClass;
    };

    return model;
}

export function Method(meta?: MethodMeta) {
    return (modelClass, method, descriptor) => {
        // if (modelClass[method]) {
        //     modelClass[method]._super = _inherit(descriptor.value);
        // }
        // modelClass[method].prototype = method;
    };
}

export function Override() {
    return (modelClass, field, descriptor) => {
        let className = modelClass.className;
        classMap[className][field] = descriptor.value;
    };
}

export class SuperClass extends Parse.Object {
    public _super: any;
    public prototype: any;
    public __proto__: any;
    /**
     * Example for properties (parameter input) to override this own class
     * @example
     *  let properties = {
     *      age: 10,
     *      address: {
     *          city: 'HCM',
     *          country: 'VN'
     *      },
     *      print: function() {
     *          console.log("Name:", this.name, ", age:". this.age)
     *      },
     *      
     *  }
     */
    public enhance(properties) {
        let prototype = Object.getPrototypeOf(this);
        let _super = Object.create(prototype);
        for (let name in properties) {
            if (!_.isFunction(properties[name]) || !hasCalledSuper(properties[name])) {
                /**
                 * #case 1:
                 *  "simple" property (primitive type or object)
                 *  or function but in body function does not call this._super()
                 */
                prototype[name] = properties[name];
            } else if (_.isFunction(prototype[name]) && prototype.hasOwnProperty(name)) {
                /**
                 * #case 2:
                 *  dirived function has called this.super()
                 *  and base class has this function
                 *  (remind: this refer to own function)
                 *  call anonymous function to break a closure;
                 */
                prototype[name] = (function (_name, fn, previous) {
                    return function () {
                        let tmp = this._super;
                        this._super = previous;
                        let ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, properties[name], prototype[name]);
            } else if (_.isFunction(_super[name])) {
                /**
                 * #case 3:
                 *  dirived function has called this.super()
                 *  and base class has no this function
                 *  but parent has this function, assign parent function to this;
                 */
                prototype[name] = (function (_name, fn) {
                    return function () {
                        let tmp = this._super;
                        this._super = _super[_name];
                        let ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, properties[name]);
            }
        }
        this.prototype = prototype;
        this._super = _super;
    };
}

export function getModel(modelName) {
    return classMap[modelName];
}
