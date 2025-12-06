import { Box, Button, ButtonGroup, Clipboard, Flex, IconButton } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FiCheck, FiClipboard, FiPlay, FiSquare } from "react-icons/fi";
import { AlgoForm, FormData } from "../components/AlgoForm";
import { AudioAnalyzer } from "../components/AudioAnalyzer";

async function playNoise(context: AudioContext, algorithm: string): Promise<AudioWorkletNode> {
  try {
    await context.audioWorklet.addModule("js/audio-processor.js");
  } catch (err: unknown) {
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

function replaceCode(pathname: string, formData: FormData): string {
  const idx = pathname.lastIndexOf("/");
  if (idx >= 0) {
    return pathname.substring(0, idx + 1) + encodeURIComponent(window.btoa(JSON.stringify(formData)));
  }

  return pathname;
}

interface HomeProps {
  code: string;
}

export function Home({ code }: HomeProps) {
  const { algorithm, sampleRate } = JSON.parse(decodeURIComponent(window.atob(code ?? ""))) as FormData;
  const [formData, setFormData] = useState<FormData>({ algorithm, sampleRate });
  const [context, setContext] = useState<AudioContext>();
  const [audio, setAudio] = useState<MediaStream>();
  const [node, setNode] = useState<AudioWorkletNode>();

  const url = replaceCode(window.location.href, formData);

  const isPlaying = !!node;

  const start = useCallback(async () => {
    const ctx = new AudioContext({ sampleRate: formData.sampleRate });
    setContext(ctx);

    const node = await playNoise(ctx, formData?.algorithm);
    const streamNode = ctx.createMediaStreamDestination();
    node.connect(streamNode);

    setAudio(streamNode.stream);
    setNode(node);
  }, [formData.algorithm, formData.sampleRate]);

  const stop = useCallback(() => {
    node?.disconnect();
    setNode(undefined);
  }, [node]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      void start();
    }
  }, [isPlaying, start, stop]);

  const handleUpdate = useCallback(
    (data: FormData) => {
      setFormData(data);
      if (isPlaying) stop();
      void start();
    },
    [isPlaying, start, stop]
  );

  return (
    <Box>
      <Flex m={3} gap={2}>
        <ButtonGroup size="sm" attached variant="surface">
          <Button onClick={toggle}>
            {isPlaying ? <FiSquare /> : <FiPlay />}
            {isPlaying ? "Stop" : "Start"}
          </Button>
        </ButtonGroup>

        <Box flex={1}>
          <AlgoForm algorithm={formData.algorithm} sampleRate={formData.sampleRate} onUpdate={handleUpdate} />
        </Box>
        <Box>
          <Clipboard.Root value={url}>
            <Clipboard.Trigger asChild>
              <IconButton size="sm" variant="surface" aria-label="Copy URL to clipboard">
                <Clipboard.Indicator copied={<FiCheck color="green" />}>
                  <FiClipboard />
                </Clipboard.Indicator>
              </IconButton>
            </Clipboard.Trigger>
          </Clipboard.Root>
        </Box>
      </Flex>

      {audio && context && <AudioAnalyzer context={context} audioStream={audio} />}
    </Box>
  );
}
