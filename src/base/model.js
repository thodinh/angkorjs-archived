"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
require("reflect-metadata");
var Parse = require("parse");
// import { extend, SuperClass, build } from "./class-utils";
var formatMetadataKey = Symbol("format");
var classMap = {};
var fnTest = /xyz/.test(function () { xyz(); }) ? /\b_super\b/ : /.*/;
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
                prototype[name_1] = typeof targetProp[name_1] === "function"
                    && typeof _super_1[name_1] === "function"
                    && fnTest.test(targetProp[name_1]) ?
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
                    })(name_1, targetProp[name_1]) : targetProp[name_1];
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
var SuperClass = /** @class */ (function (_super) {
    __extends(SuperClass, _super);
    function SuperClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // public enhance: (properties: any) => void;
    SuperClass.enhance = function (properties) {
        var _super = Object.create(this.__proto__.__proto__);
        // let This = this;
        var prototype = Object.create(this.__proto__);
        for (var name_2 in properties) {
            if (typeof properties[name_2] !== "function"
                || !fnTest.test(properties[name_2])) {
                prototype[name_2] = properties[name_2];
            }
            else if (typeof prototype[name_2] === "function"
                && prototype.hasOwnProperty(name_2)) {
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
            else if (typeof _super[name_2] === "function") {
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
        this.__proto__ = prototype;
        this.__proto__.__proto__ = _super;
    };
    return SuperClass;
}(Parse.Object));
exports.SuperClass = SuperClass;
// SuperClass.prototype.enhance = function(properties) {
//     let _super = Object.create(this.__proto__.__proto__);
//     // let This = this;
//     let prototype = Object.create(this.__proto__);
//     for (let name in properties) {
//         if (typeof properties[name] !== "function"
//                 || !fnTest.test(properties[name])) {
//             prototype[name] = properties[name];
//         } else if (typeof prototype[name] === "function"
//                     && prototype.hasOwnProperty(name)) {
//             prototype[name] = (function (_name, fn, previous) {
//                 return function () {
//                     let tmp = this._super;
//                     this._super = previous;
//                     let ret = fn.apply(this, arguments);
//                     this._super = tmp;
//                     return ret;
//                 };
//             })(name, properties[name], prototype[name]);
//         } else if (typeof _super[name] === "function") {
//             prototype[name] = (function (_name, fn) {
//                 return function () {
//                     let tmp = this._super;
//                     this._super = _super[_name];
//                     let ret = fn.apply(this, arguments);
//                     this._super = tmp;
//                     return ret;
//                 };
//             })(name, properties[name]);
//         }
//     }
//     this.__proto__ = prototype;
//     this.__proto__.__proto__ = _super;
// };
function getModel(modelName) {
    return classMap[modelName];
}
exports.getModel = getModel;
