export function frequencyBars(canvas: HTMLCanvasElement, data: Uint8Array, freq: Uint8Array) {
  const height = canvas.height;
  const width = canvas.width;

  const context = canvas.getContext("2d")!;

  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  const barWidth = (width / freq.length) * 2.5;
  let x = 0;

  for (const barHeight of freq) {
    context.fillStyle = `rgb(${barHeight + 100},50,50)`;
    context.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
}
