import { Readable } from "stream";
import { str, intLittleEndian, shortLittleEndian } from "./byte-converters";
import { flatMap, flatten } from "./generators";

function header(frameRate, bitsPerSample) {
  let numChannels = 1; // mono
  let bytesPerSample = (bitsPerSample + 7) / 8;

  let riff = flatten(
    str("RIFF"),
    intLittleEndian(0x7FFFFFFF),
    str("WAVE"));

  let fmt = flatten(
    str("fmt "),
    intLittleEndian(16), // Subchunk1Size for PCM = 16
    shortLittleEndian(1), // AudioFormat for PCM = 1 (linear quantization)
    shortLittleEndian(numChannels),
    intLittleEndian(frameRate),
    intLittleEndian(frameRate * numChannels * bytesPerSample),
    shortLittleEndian(numChannels * bytesPerSample),
    shortLittleEndian(bitsPerSample));

  let data = flatten(
    str("data"),
    intLittleEndian(0x7fffffff));

  return flatten(riff, fmt, data);
}

export function audioStream(rawData, frameRate, bitsPerSample) {

  let gen = flatten(header(frameRate, bitsPerSample), rawData);
  let rs = Readable();
  rs.setEncoding('ascii');

  rs._read = (size) => {
    let pos = 0;
    let buf = new Buffer(size);
    while (pos < size) {
      let { done, value } = gen.next();
      if (done) {
        rs.push(buf);
        rs.push(null);
        return;
      } else {
        buf.writeUInt8(value, pos++);
      }
    }
    rs.push(buf);
  };

  return rs;
}


