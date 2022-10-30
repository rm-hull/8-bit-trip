import { Button, ButtonGroup, Container } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlay, FiSquare } from "react-icons/fi";
import AudioAnalyzer from "../components/AudioAnalyzer";

async function playNoise(context: AudioContext): Promise<AudioWorkletNode> {
  await context.audioWorklet.addModule("8-bit-trip/js/audio-processor.js");
  const audioNode = new AudioWorkletNode(context, "audio-processor");
  audioNode.connect(context.destination);
  return audioNode;
}

export default function Home(): JSX.Element {
  const [audio, setAudio] = useState<MediaStream | null>(null);
  const [node, setNode] = useState<AudioWorkletNode | null>(null);
  const isPlaying = !!audio;

  const start = async () => {
    const context = new AudioContext();
    const node = await playNoise(context);
    const streamNode = context.createMediaStreamDestination();
    node.connect(streamNode);

    setAudio(streamNode.stream);
    setNode(node);
  };

  const stop = () => {
    node?.disconnect();
    audio?.getTracks().forEach((track) => track.stop());
    setAudio(null);
  };

  const toggle = async () => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  };

  return (
    <Container>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button leftIcon={isPlaying ? <FiSquare /> : <FiPlay />} onClick={toggle}>
          {isPlaying ? "Stop" : "Start"}
        </Button>
      </ButtonGroup>
      {isPlaying ? <AudioAnalyzer audioStream={audio} /> : undefined}
    </Container>
  );
}
