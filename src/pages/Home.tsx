import { Box, Button, ButtonGroup, Flex, IconButton, Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiCheck, FiClipboard, FiPlay, FiSquare } from "react-icons/fi";
import { useParams } from "react-router-dom";
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

function replaceCode(pathname: string, formData: FormData): string {
  const idx = pathname.lastIndexOf("/");
  if (idx >= 0) {
    return pathname.substring(0, idx + 1) + encodeURIComponent(window.btoa(JSON.stringify(formData)));
  }

  return pathname;
}

export default function Home(): JSX.Element {
  const { code } = useParams();
  const { algorithm, sampleRate } = JSON.parse(decodeURIComponent(window.atob(code ?? "")));
  const [formData, setFormData] = useState<FormData>({ algorithm, sampleRate });
  const [context, setContext] = useState<AudioContext>();
  const [audio, setAudio] = useState<MediaStream>();
  const [node, setNode] = useState<AudioWorkletNode>();

  const { hasCopied, onCopy, setValue } = useClipboard("");
  const url = replaceCode(window.location.href, formData);
  useEffect(() => setValue(url), [setValue, url]);

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
        <Box m={1}>
          <Tooltip label="Copy URL to Clipboard">
            <IconButton
              size="sm"
              onClick={onCopy}
              aria-label="Copy URL to clipboardx"
              icon={hasCopied ? <FiCheck color="green" /> : <FiClipboard />}
            />
          </Tooltip>
        </Box>
      </Flex>

      {audio && context && <AudioAnalyzer context={context} audioStream={audio} />}
    </Box>
  );
}
