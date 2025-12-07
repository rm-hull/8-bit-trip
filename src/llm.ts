import type { MLCEngine } from "@mlc-ai/web-llm";

async function getLibrary() {
  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
  return { CreateMLCEngine };
}

let model: MLCEngine | null = null;
const clipMessage =
  " It can take a while when we first visit this page to populate the cache. Later refreshes will become faster.";

export function isWebGPUAvailable(): boolean {
  return typeof navigator !== "undefined" && !!(navigator as any).gpu;
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* downloadModel(modelName: string): AsyncGenerator<string> {
  try {
    yield `Initializing MLC web-llm`;

    if (!isWebGPUAvailable()) {
      throw new Error("WebGPU is not available");
    }

    const progressQueue: string[] = [];
    const { CreateMLCEngine } = await getLibrary();
    const engineOpts: MLCEngineConfig = {
      initProgressCallback: (progress: string) => {
        progressQueue.push(progress.text.replace(clipMessage, ""));
      },
    };

    let done = false;
    const downloadPromise = (async () => {
      try {
        model = await CreateMLCEngine(modelName, engineOpts);
      } finally {
        done = true;
      }
    })();

    // Poll for progress updates until done
    while (!done || progressQueue.length > 0) {
      while (progressQueue.length > 0) {
        yield `${progressQueue.shift()!}`;
      }
      if (!done) await delay(250);
    }

    await downloadPromise;
    yield `${modelName}: downloaded successfully!\n`;
  } catch (error) {
    yield `Error initializing: ${modelName}`;
    yield `${error instanceof Error ? error.message : String(error)}`;
    throw error;
  }
}

export async function systemPrompt(instructions: string, prompt: string): Promise<string> {
  if (!model) {
    throw new Error("Model not initialized");
  }

  const response = await model.chat.completions.create({
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: prompt },
    ],
    stream: true,
  });

  let answer = "";
  for await (const chunk of response) {
    if (chunk.choices.length > 0) {
      const content = chunk.choices[0].delta.content ?? "";
      answer += content;
    }
  }

  console.log(answer);
  return answer;
}
