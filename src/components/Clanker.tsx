import { Alert, Em, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { downloadModel, systemPrompt } from "@/llm";

type ClankerProps = {
  algorithm: string;
};

const instructions = `
You are an expert music critic with a classically trained ear for high fidelity. The user will 
want your (biting) assessment of their beatbyte creation. Pull no punches, and
dont be afraid to offend, but try and be accurate. Don't get confused and mention anything about Minecraft.
`;

export function Clanker({ algorithm }: ClankerProps) {
  const [initialized, setInitialized] = useState(false);
  const [summary, setSummary] = useState<string | undefined>();
  useEffect(() => {
    async function initLLM() {
      for await (const progress of downloadModel("Llama-3.2-3B-Instruct-q4f32_1-MLC")) {
        setSummary(progress);
      }
      setInitialized(true);
      setSummary("-ummm-");
    }
    if (!initialized) {
      void initLLM();
    }
  }, [initialized, setInitialized, setSummary]);

  useEffect(() => {
    if (initialized) {
      void systemPrompt(
        instructions,
        `Analyze the following expression carefully and give a punchy one or two sentence summary
describing what the audio output might be like. No need to tell me you are giving a summary, 
just do it. 

\`\`\`
${algorithm}
\`\`\`
`
      ).then(setSummary);
    }
  }, [initialized, setSummary, algorithm]);

  if (!summary) {
    return null;
  }

  return (
    <Alert.Root>
      <Alert.Indicator fontSize="48px">🤖</Alert.Indicator>
      <Alert.Content>
        <Alert.Title>
          <Heading size="md">Clanker says...</Heading>
        </Alert.Title>
        <Alert.Description>{initialized ? summary : <Em color="fg.muted">{summary}</Em>}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
