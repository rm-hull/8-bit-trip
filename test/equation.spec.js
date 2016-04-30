import chai from "chai";

import { validate, compute } from "../src/equation";

let should = chai.should();

describe("Equation", () => {

  describe("validation", () => {

    ["t+3", "t<<5", "(t+5)*t>>2", "x+y", "1e7"].forEach(expr => {
      it("should allow simple expression: " + expr, () => {
        validate(expr).should.equal(expr);
      });
    });

    ["console.log(", "Math.sin(t)", "a+b"].forEach(expr => {
      it("should not allow invalid expression: " + expr, () => {
        (() => { validate(expr); }).should.throw("Invalid expression: " + expr);
      });
    });

    ["t--2"].forEach(expr => {
      it("should not allow invalid expression: " + expr, () => {
        (() => { validate(expr); }).should.throw("Unexpected number");
      });
    });

    ["(t*t"].forEach(expr => {
      it("should not allow invalid expression: " + expr, () => {
        (() => { validate(expr); }).should.throw("Unexpected end of input");
      });
    });
  });

  describe("generator", () => {

    it("should produce an iteration of expected values", () => {
      var gen = compute("t*3");
      gen.next().value.should.equal(0);
      gen.next().value.should.equal(3);
      gen.next().value.should.equal(6);
      gen.next().value.should.equal(9);
    });
  });
});


