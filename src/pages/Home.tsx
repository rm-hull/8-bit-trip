import { Button, ButtonGroup, Container } from "@chakra-ui/react";
import { useState } from "react";
import { FiPause, FiPlay, FiSquare } from "react-icons/fi";
import AudioAnalyzer from "../components/AudioAnalyzer";

export default function Home(): JSX.Element {
  const [audio, setAudio] = useState<MediaStream | null>(null);
  const isPlaying = !!audio;

  const start = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    setAudio(media);
  };

  const stop = () => {
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
        <Button leftIcon={<FiPause />} onClick={stop}>
          Pause
        </Button>
      </ButtonGroup>
      {isPlaying ? <AudioAnalyzer audioStream={audio} /> : undefined}
    </Container>
  );
}
