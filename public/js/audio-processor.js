// random-noise-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  #t = 0;

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      let t = this.#t;
      for (let i = 0; i < channel.length; i++) {
        t++;
        channel[i] = (compute(t) & 0xff) / 128.0 - 1;
      }
    });
    this.#t += output[0].length;
    return true;
  }
}

function compute(t) {
  return (
    (((-t & 4095) * (255 & (t * (t & (t >> 13))))) >> 12) +
    (127 & ((t * (234 & (t >> 8) & (t >> 3))) >> (3 & (t >> 14))))

    // (1 - (((t + 10) >> ((t >> 9) & 15)) & 2)) * 2 * (((t >> 10) ^ ((t + 20) >> 10)) & 1) * 32 +
    // (((t & 4095) - 2047) * ((t / (((t >> 10) & 3) + 1)) & (((t >> 10) & 7) + 5)) +
    //   (((((t >> (((t >> 12) + 16) & 25)) & 1) * t) % 512) * ((t % 256) - 128)) / 2) /
    //   1024 +
    // 128

    // t < 65536
    //   ? (((2 * t * (t >> 11)) & (t - 1)) | ((t >> 4) - 1)) % 64
    //   : t % 98304 > 65536
    //   ? (((17 * t * ((2 * t) >> 8)) & (t - 1)) | ((t >> 6) - 1)) % 64 | (t >> 4)
    //   : (((15 * t * ((2 * t) >> 16)) & (t - 1)) | ((t >> 8) - 1)) % 64 | (t >> 4)

    // t * ((t >> (8 * ((t >> 15) | (t >> 8)))) & (20 | (((t >> 19) * 5) >> t) | (t >> 3)))

    // ((t >> 6) | t | (t >> (t >> 16))) * 10 + ((t >> 11) & 7)

    // t * (((t >> 9) | (t >> 13)) & 25 & (t >> 6))

    // t & 4096 ? ((t * (t ^ t % 255)) | (t >> 4)) >> 1 : (t >> 3) | (t & 8192 ? t << 2 : t)

    // ((t * ((t >> 8) | (t >> 9))) & 46 & (t >> 8)) ^ ((t & (t >> 13)) | (t >> 6))
  );
}

registerProcessor("audio-processor", AudioProcessor);
