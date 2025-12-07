import { Alert } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { downloadModel, systemPrompt } from "@/llm";

type ClankerProps = {
  algorithm: string;
};

const instructions = `
Analyze the following bytebeat carefully and give a punchy 1- or 2-sentence summary describing 
what the audio output will be like. No need to tell me you are giving a summary, just do it. Be
expressive and poetic.`;

export function Clanker({ algorithm }: ClankerProps) {
  console.log(algorithm);
  const [summary, setSummary] = useState<string | undefined>();
  useEffect(() => {
    async function initLLM() {
      for await (const progress of downloadModel("Llama-3.2-3B-Instruct-q4f32_1-MLC")) {
        //, "Llama-3.2-1B-Instruct-q4f16_1-MLC")) {
        setSummary(progress);
      }
    }
    initLLM()
      .then(() => systemPrompt(instructions, algorithm))
      .then(setSummary)
      .catch((err) => {
        setSummary(err.message);
      });
  }, [setSummary, algorithm]);

  if (!summary) {
    return null;
  }

  console.log(summary);

  return (
    <Alert.Root>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Clanker says...</Alert.Title>
        <Alert.Description>{summary}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
