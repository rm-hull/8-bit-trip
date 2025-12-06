import { useEffect, useRef } from "react";

type VisualizerProps = {
  audioData: Uint8Array;
  frequencies: Uint8Array;
  width?: number | string;
  height?: number | string;
  draw: (canvas: HTMLCanvasElement, data: Uint8Array, frequencies: Uint8Array) => void;
};

export function Visualizer({ audioData, frequencies, draw, width = 300, height = 300 }: VisualizerProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      draw(ref.current, audioData, frequencies);
    }
  }, [audioData, draw, frequencies]);

  return <canvas width={width} height={height} ref={ref} />;
}

// adapted from: https://github.com/philnash/react-web-audio/blob/master/src/AudioVisualiser.js
