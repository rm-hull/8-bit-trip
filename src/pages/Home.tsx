import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlay, FiSquare } from "react-icons/fi";
import AlgoForm, { FormData } from "../components/AlgoForm";
import AudioAnalyzer from "../components/AudioAnalyzer";

async function playNoise(context: AudioContext, algorithm: string): Promise<AudioWorkletNode> {
  try {
    await context.audioWorklet.addModule("js/audio-processor.js");
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.warn("Failed to load audio-worklet, trying dev fallback...", { err });
    await context.audioWorklet.addModule("8-bit-trip/js/audio-processor.js");
  }
  const audioNode = new AudioWorkletNode(context, "audio-processor", {
    processorOptions: {
      samepleRate: context.sampleRate,
      algorithm,
    },
  });
  audioNode.connect(context.destination);
  return audioNode;
}

export default function Home(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    algorithm: "((-t&4095)*(255&t*(t&t>>13))>>12)+(127&t*(234&t>>8&t>>3)>>(3&t>>14))",
    sampleRate: 8000,
  });
  const [context, setContext] = useState<AudioContext>();
  const [audio, setAudio] = useState<MediaStream>();
  const [node, setNode] = useState<AudioWorkletNode>();
  const isPlaying = !!node;

  const start = async () => {
    const ctx = new AudioContext({ sampleRate: formData.sampleRate });
    setContext(ctx);

    const node = await playNoise(ctx, formData?.algorithm);
    const streamNode = ctx.createMediaStreamDestination();
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
    <Box>
      <Flex m={3}>
        <ButtonGroup m={1} size="sm" isAttached variant="outline">
          <Button leftIcon={isPlaying ? <FiSquare /> : <FiPlay />} onClick={toggle}>
            {isPlaying ? "Stop" : "Start"}
          </Button>
        </ButtonGroup>

        <Box flex={1} m={1}>
          <AlgoForm
            algorithm={formData.algorithm}
            sampleRate={formData.sampleRate}
            onUpdate={(data) => {
              setFormData(data);
              if (isPlaying) stop();
              start();
            }}
          />
        </Box>
      </Flex>
      {audio && context && <AudioAnalyzer context={context} audioStream={audio} />}
    </Box>
  );
}
