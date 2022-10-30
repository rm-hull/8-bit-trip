// random-noise-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  #t = 0;
  #v = 0;

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
      for (let i = 0; i < channel.length; i++) {
        t++;
        channel[i] = (eval(this.alg) & 0xff) / 128.0 - 1;
      }
      this.#v = v;
      this.#t = t;
    });

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
