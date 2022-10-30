import { Button, ButtonGroup, Container } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlay, FiSquare } from "react-icons/fi";
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
  const [context, setContext] = useState<AudioContext>();
  const [audio, setAudio] = useState<MediaStream>();
  const [node, setNode] = useState<AudioWorkletNode>();
  const isPlaying = !!node;
  const sampleRate = 8000;

  const start = async () => {
    const ctx = new AudioContext({ sampleRate });
    setContext(ctx);

    const node = await playNoise(
      ctx,
      "t>>4|t&(t>>5)/(t>>7-(t>>15)&-t>>7-(t>>15))"
      // "(t/((t>>16|t>>8))&((t>>5|t>>11)))-1|t*((t>>16|t>>8))"
      // "t*((t>>3|t>>9)&82&t>>9)"
      // "t*((t+13217)/1211)&(t>>2|t>>4|t>>6)/512"
      // "(t|(t>>9|t>>7))*t&(t>>11|t>>9)"
      // "(t>>7|t|t>>6)*10+4*(t&t>>13|t>>6)"
      // "((-t&4095)*(255&t*(t&t>>13))>>12)+(127&t*(234&t>>8&t>>3)>>(3&t>>14))"
      // "(t/10000000*t*t+t)%127|t>>3"
      // "(t&t%255)-(t*3&t>>13&t>>6)"
      // "v=(v>>1)+(v>>4)+t*(((t>>16)|(t>>6))&(69&(t>>9)))"
      // "(t<65536)?((2*t*(t>>11)&(t- 1)|(t>>4)-1)%64):(((t%98304)>65536)?((17*t*(2*t>>8)&(t-1)|(t>>6)-1)%64|(t>>4)):((15*t*(2*t>>16)&(t-1)|(t>>8)-1)%64|(t>>4)))"
      // "t>>6^t&37|t+(t^t>>11) -t*((t%24?2:6)&t>>11)^t<<1 &(t&598?t>>4:t>>10)"
      // "t*(t^t+(t>>15|1)^(t-1280^t)>>10)"
      // "(t*9&t>>4|t*5&t>>7|t*3&t/1024)-1"
      // "(t|t>>5)&(t|t>>13)-(t|t>>21)"
      // "(t*(t>>5|t>>8))>>(t>>16)"
      // "(t%(t/(t>>9|t>>13)))"
      // "((t*(t>>8|t>>9)&46&t>>8))^(t&t>>13|t>>6)"
      // "((-t&4095)*(255&t*(t&t>>13))>>12)+(127&t*(234&t>>8&t>>3)>>(3&t>>14))"
      // "(t*(t>>8*(t>>15|t>>8)&(20|(t>>19)*5>>t|t>>3)))"
      // "(t>>6|t|t>>(t>>16))*10+((t>>11)&7)",
      // "((1-(((t+10)>>((t>>9)&((t>>14))))&(t>>4&-2)))*2)*(((t>>10)^((t+((t>>6)&127))>>10))&1)*32+128"
      // "16 * t*t* (t >>11)/7"
      // "(t|t>>5)&(t|t>>13)-(t|t>>21)"
      // "t>>4|t&(t>>5)/(t>>7-(t>>15)&-t>>7-(t>>15))"
    );
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
    <Container>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button leftIcon={isPlaying ? <FiSquare /> : <FiPlay />} onClick={toggle}>
          {isPlaying ? "Stop" : "Start"}
        </Button>
      </ButtonGroup>
      {audio && context && <AudioAnalyzer context={context} audioStream={audio} />}
    </Container>
  );
}
