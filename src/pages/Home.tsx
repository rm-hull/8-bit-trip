import { Button, ButtonGroup, Container } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlay, FiSquare } from "react-icons/fi";
import AudioAnalyzer from "../components/AudioAnalyzer";

async function playNoise(context: AudioContext): Promise<AudioWorkletNode> {
  try {
    await context.audioWorklet.addModule("js/audio-processor.js");
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.warn("Failed to load audio-worklet, trying dev fallback...", { err });
    await context.audioWorklet.addModule("8-bit-trip/js/audio-processor.js");
  }
  const audioNode = new AudioWorkletNode(context, "audio-processor");
  audioNode.connect(context.destination);
  return audioNode;
}

export default function Home(): JSX.Element {
  const [audio, setAudio] = useState<MediaStream>();
  const [node, setNode] = useState<AudioWorkletNode>();
  const isPlaying = !!node;

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
    setNode(undefined);
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
      {audio && <AudioAnalyzer audioStream={audio} />}
    </Container>
  );
}
