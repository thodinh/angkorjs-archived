"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Parse = require("parse");
var _ = require("underscore");
var classMap = {};
/**
 * Refer to explain:
 *  - https://stackoverflow.com/questions/3911690/strange-javascript-idiom-what-does-xyz-testfunctionxyz-do
 *  - https://stackoverflow.com/questions/5924796/xyz-testfunctionxyz-b-super-b?noredirect=1&lq=1
 *
 * Check what is Function.prototype.toString() return to
 * Becasue some JS platform will function body
 * or return a string like this "[object Function]" or something else
 */
var fnTest = /xyz/.test(function () {
    'xyz()';
}.toString()) ? /\b_super\b/ : /.*/;
var hasCalledSuper = function (prop) { return fnTest.test(prop); };
function Model(meta) {
    var className = meta.className, extendClass = meta.extendClass, inherit = meta.inherit, inherits = meta.inherits;
    var model = function (target) {
        var basedClass = classMap[className];
        if (basedClass) {
            var _super_1 = basedClass.prototype;
            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            // initializing = true;
            var prototype = new basedClass();
            // initializing = false;
            var targetProp = target.prototype;
            // tslint:disable-next-line:forin
            for (var name_1 in targetProp) {
                // Check if we're overwriting an existing function
                if (_.isFunction(targetProp[name_1]) && hasCalledSuper(targetProp[name_1])) {
                    prototype[name_1] =
                        (function (_name, fn) {
                            return function () {
                                var tmp = this._super;
                                // Add a new ._super() method that is the same method
                                // but on the super-class
                                this._super = _super_1[_name];
                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);
                                this._super = tmp;
                                return ret;
                            };
                        })(name_1, targetProp[name_1]);
                }
                else {
                    prototype[name_1] = targetProp[name_1];
                }
            }
            basedClass.prototype = prototype;
            basedClass.constructor = basedClass;
        }
        else {
            basedClass = target;
        }
        basedClass.prototype.className = className;
        classMap[className] = basedClass;
        Parse.Object.registerSubclass(className, basedClass);
        return basedClass;
    };
    return model;
}
exports.Model = Model;
function Method(meta) {
    return function (modelClass, method, descriptor) {
        // if (modelClass[method]) {
        //     modelClass[method]._super = _inherit(descriptor.value);
        // }
        // modelClass[method].prototype = method;
    };
}
exports.Method = Method;
function Override() {
    return function (modelClass, field, descriptor) {
        var className = modelClass.className;
        classMap[className][field] = descriptor.value;
    };
}
exports.Override = Override;
var SuperClass = /** @class */ (function (_super_1) {
    __extends(SuperClass, _super_1);
    function SuperClass() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
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
    SuperClass.prototype.enhance = function (properties) {
        var prototype = Object.getPrototypeOf(this);
        var _super = Object.create(prototype);
        for (var name_2 in properties) {
            if (!_.isFunction(properties[name_2]) || !hasCalledSuper(properties[name_2])) {
                /**
                 * #case 1:
                 *  "simple" property (primitive type or object)
                 *  or function but in body function does not call this._super()
                 */
                prototype[name_2] = properties[name_2];
            }
            else if (_.isFunction(prototype[name_2]) && prototype.hasOwnProperty(name_2)) {
                /**
                 * #case 2:
                 *  dirived function has called this.super()
                 *  and base class has this function
                 *  (remind: this refer to own function)
                 *  call anonymous function to break a closure;
                 */
                prototype[name_2] = (function (_name, fn, previous) {
                    return function () {
                        var tmp = this._super;
                        this._super = previous;
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name_2, properties[name_2], prototype[name_2]);
            }
            else if (_.isFunction(_super[name_2])) {
                /**
                 * #case 3:
                 *  dirived function has called this.super()
                 *  and base class has no this function
                 *  but parent has this function, assign parent function to this;
                 */
                prototype[name_2] = (function (_name, fn) {
                    return function () {
                        var tmp = this._super;
                        this._super = _super[_name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name_2, properties[name_2]);
            }
        }
        this.prototype = prototype;
        this._super = _super;
    };
    ;
    return SuperClass;
}(Parse.Object));
exports.SuperClass = SuperClass;
function getModel(modelName) {
    return classMap[modelName];
}
exports.getModel = getModel;
//# sourceMappingURL=model.js.map