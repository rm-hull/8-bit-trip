export function sineWave(canvas: HTMLCanvasElement, data: Uint8Array) {
  const height = canvas.height;
  const width = canvas.width;
  const context = canvas.getContext("2d")!;
  let x = 0;
  const sliceWidth = (width * 1.0) / data.length;

  context.lineWidth = 2;
  context.strokeStyle = "#000000";
  context.clearRect(0, 0, width, height);

  context.beginPath();
  context.moveTo(0, height / 2);

  for (const item of data) {
    const y = (item / 255.0) * height;
    context.lineTo(x, y);
    x += sliceWidth;
  }
  context.lineTo(x, height / 2);
  context.stroke();
}
