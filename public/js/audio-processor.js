// random-noise-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  #t = 0;
  #v = 0;
  #x = 0;
  #y = 0;

  constructor(params) {
    super();
    const { processorOptions } = params;
    this.alg = processorOptions.algorithm;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      let t = this.#t;
      let v = this.#v;
      let x = this.#x;
      let y = this.#y;
      for (let i = 0; i < channel.length; i++) {
        t++;
        channel[i] = (eval(this.alg) & 0xff) / 128.0 - 1;
      }
      this.#t = t;
      this.#v = v;
      this.#x = x;
      this.#y = y;
    });

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
