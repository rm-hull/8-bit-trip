// class AudioVisualiser extends Component {
//   constructor(props) {
//     super(props);
//     this.canvas = React.createRef();
//   }

import { createRef, useEffect } from "react";

//   componentDidUpdate() {
//     this.draw();
//   }

//   draw() {
//     const { audioData } = this.props;
//     const canvas = this.canvas.current;
//     const height = canvas.height;
//     const width = canvas.width;
//     const context = canvas.getContext("2d");
//     let x = 0;
//     const sliceWidth = (width * 1.0) / audioData.length;

//     context.lineWidth = 2;
//     context.strokeStyle = "#000000";
//     context.clearRect(0, 0, width, height);

//     context.beginPath();
//     context.moveTo(0, height / 2);
//     for (const item of audioData) {
//       const y = (item / 255.0) * height;
//       context.lineTo(x, y);
//       x += sliceWidth;
//     }
//     context.lineTo(x, height / 2);
//     context.stroke();
//   }

type AudioVisualizerProps = {
  audioData: Uint8Array;
};

export default function AudioVisualizer({ audioData }: AudioVisualizerProps): JSX.Element {
  const ref = createRef<HTMLCanvasElement>();
  useEffect(() => {
    const canvas = ref.current!;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext("2d")!;
    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);

    for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  }, [audioData, ref]);

  return <canvas width={300} height={300} ref={ref} />;
}

// adapted from: https://github.com/philnash/react-web-audio/blob/master/src/AudioVisualiser.js
