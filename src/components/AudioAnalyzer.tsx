import { Container, Span, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { frequencyBars } from "../visualizations/frequencyBars";
import { sineWave } from "../visualizations/sineWave";
import { Visualizer } from "./AudioVisualizer";

type AudioAnalyzerProps = {
  context: AudioContext;
  audioStream: MediaStream;
  fftSize?: number;
};

export function AudioAnalyzer({ context, audioStream, fftSize = 256 }: AudioAnalyzerProps) {
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(0));
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(0));

  useEffect(() => {
    const analyzer = context.createAnalyser();
    analyzer.fftSize = fftSize;

    const source = context.createMediaStreamSource(audioStream);
    source.connect(analyzer);

    let rafId: number;

    const tick = () => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteTimeDomainData(dataArray);
      setWaveformData(dataArray);

      const frequenciesArray = new Uint8Array(analyzer.fftSize);
      analyzer.getByteFrequencyData(frequenciesArray);
      setFrequencyData(frequenciesArray);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      analyzer.disconnect();
      source.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [audioStream, context, fftSize]);

  return (
    <VStack>
      <Visualizer width={800} audioData={waveformData} frequencies={frequencyData} draw={sineWave} />;
      <Visualizer width={800} audioData={waveformData} frequencies={frequencyData} draw={frequencyBars} />;
      <Container>
        Time: <Span fontFamily="mono"> {context.currentTime.toFixed(3)} s</Span>
      </Container>
    </VStack>
  );
}

// adapted from: https://github.com/philnash/react-web-audio/blob/master/src/AudioAnalyser.js
