// random-noise-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  #t = 0;

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      let t = this.#t;
      for (let i = 0; i < channel.length; i++) {
        t++;
        channel[i] = compute(t) / 128.0 - 1;
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
  );
}

registerProcessor("audio-processor", AudioProcessor);
