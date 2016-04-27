import chai from "chai";

import { intLittleEndian } from "../src/byte-converters";
import { flatten, flatMap } from "../src/generators";

let should = chai.should();

describe("Generators", () => {

  it("should yield a flattened sequence of generated values", () => {

    var gen = flatten(
      intLittleEndian(0xCAFEBABE),
      intLittleEndian(0xDEADBEEF));

    gen.next().should.deep.equal({ done: false, value: 0xBE });
    gen.next().should.deep.equal({ done: false, value: 0xBA });
    gen.next().should.deep.equal({ done: false, value: 0xFE });
    gen.next().should.deep.equal({ done: false, value: 0xCA });
    gen.next().should.deep.equal({ done: false, value: 0xEF });
    gen.next().should.deep.equal({ done: false, value: 0xBE });
    gen.next().should.deep.equal({ done: false, value: 0xAD });
    gen.next().should.deep.equal({ done: false, value: 0xDE });
    gen.next().should.deep.equal({ done: true, value: undefined });
  });

  it("should flatmap over a sequence", () => {
    var gen = flatMap(intLittleEndian, [1,2,3]);

    gen.next().should.deep.equal({ done: false, value: 1 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 2 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 3 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: true, value: undefined });
  });
});


