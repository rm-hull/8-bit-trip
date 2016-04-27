import chai from "chai";

import { str, shortLittleEndian, intLittleEndian } from "../src/byte-converters";

let should = chai.should();

describe("Byte converters", () => {

  it("should handle zero short properly", () => {
    var gen = shortLittleEndian(0);
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: true, value: undefined });
  });

  it("should handle zero int properly", () => {
    var gen = intLittleEndian(0);
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: false, value: 0 });
    gen.next().should.deep.equal({ done: true, value: undefined });
  });

  it("should yield two values for a short", () => {
    var gen = shortLittleEndian(0xDEADBEEF);
    gen.next().should.deep.equal({ done: false, value: 0xEF });
    gen.next().should.deep.equal({ done: false, value: 0xBE });
    gen.next().should.deep.equal({ done: true, value: undefined });
  });

  it("should yield four values for a long", () => {
    var gen = intLittleEndian(0xCAFEBABE);
    gen.next().should.deep.equal({ done: false, value: 0xBE });
    gen.next().should.deep.equal({ done: false, value: 0xBA });
    gen.next().should.deep.equal({ done: false, value: 0xFE });
    gen.next().should.deep.equal({ done: false, value: 0xCA });
    gen.next().should.deep.equal({ done: true, value: undefined });
  });

  it("should yield sequence of bytes for string", () => {
    var gen = str("RIFF");
    gen.next().should.deep.equal({ done: false, value: 82 });
    gen.next().should.deep.equal({ done: false, value: 73 });
    gen.next().should.deep.equal({ done: false, value: 70 });
    gen.next().should.deep.equal({ done: false, value: 70 });
    gen.next().should.deep.equal({ done: true, value: undefined });
  });
});


