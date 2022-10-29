import { useEffect, useState } from "react";
import AudioVisualizer from "./AudioVisualizer";

type AudioAnalyzerProps = {
  audioStream: MediaStream;
};

export default function AudioAnalyzer({ audioStream }: AudioAnalyzerProps): JSX.Element {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));

  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyzer = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyzer);

    let rafId: number;

    const tick = () => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteTimeDomainData(dataArray);
      setAudioData(dataArray);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      analyzer.disconnect();
      source.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [audioStream]);

  return <AudioVisualizer audioData={audioData} />;
}

// adapted from: https://github.com/philnash/react-web-audio/blob/master/src/AudioAnalyser.js
