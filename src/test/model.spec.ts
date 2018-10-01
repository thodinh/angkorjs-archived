import "mocha";
import { should, expect, assert } from "chai";
import * as model from "../base/model";

describe("Model", () => {
    @model.Model({ className: "Staff" })
    class StaffBase extends model.SuperClass {
        public seniority = 0;
        public addSeniority(addYear) {
            return this.seniority + addYear;
        }
        public print(msg) {
            console.log("StaffBase: ", msg);
        }
    }

    let Staff = model.getModel("Staff");
    let s = new Staff();

    it("Create model # not null", (done) => {
        expect(Staff).not.equal(null, "Failed define a model");
        done();
    });

    it("Create model # with right className", (done) => {
        expect(s.className).equal("Staff", "Wrong className");
        done();
    });

    it("Create model # extended", (done) => {
        expect(typeof s.print).equal("function", "Not extended yet");
        done();
    });

    it("Create model # undefined method", (done) => {
        expect(s.printx).equal(undefined);
        done();
    });

    it("Create model # has _super injected", (done) => {
        // s.print();
        // expect(Staff.prototype._super).not.equal(undefined);
        done();
    });

    it("Create model # override method", (done) => {
        // @model.Model({ className: "Staff" })
        // class StaffExtend extends model.SuperClass {
        //     public addSeniority(year) {
        //         return this._super();
        //         // return this.seniority + year * 2;
        //     }
        // }
        // let ss = new Staff();
        // var seniority = ss.addSeniority(5);
        // expect(seniority).equal(10);
        done();
    });

    it("Create model # override method and property", (done) => {
        @model.Model({ className: "Staff" })
        class StaffExtend extends model.SuperClass {
            // @model.Override()
            public seniority = 1;
            public addSeniority(year) {
                return this.seniority + year * 2;
            }
        }
        let ss = new Staff();
        let seniority = ss.addSeniority(5);
        expect(seniority).equal(11);
        done();
    });

    it("Create model # call _super() method", (done) => {
        @model.Model({ className: "Staff" })
        class StaffExtend extends model.SuperClass {
            public addSeniority(year) {
                let _seniority = this._super(year);
                return _seniority + 2;
            }
        }
        let ss = new Staff();
        let seniority = ss.addSeniority(5);
        expect(seniority).equal(12);
        done();
    });
    // // ss.print();
    // ss.enhance({
    //     _super_star: 5,
    //     print: function() {
    //         this._super();
    //         console.log('Only enhance');
    //     }
    // });

    // ss.enhance({
    //     _super_star: function() {
    //         var _super_star = 5;
    //     },
    //     print: function() {
    //         this._super();
    //         console.log('Only enhance');
    //     }
    // });

    // ss.enhance({
    //     print: function(msg) {
    //         this._super(msg);
    //         console.log('Only enhance');
    //     }
    // });

    // ss.print("Message");
    // s.print("Message s");
});
