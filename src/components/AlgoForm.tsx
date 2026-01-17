import {
  Field,
  Combobox,
  Portal,
  useListCollection,
  useFilter,
  Select,
  For,
  createListCollection,
  SelectValueChangeDetails,
  Flex,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

export type FormData = {
  sampleRate: number;
  algorithm: string;
};

type FormProps = Partial<FormData> & {
  onUpdate: (form: FormData) => void;
};

const choices = [
  // attribution: see youtube vids from viznut
  [8000, "(t>>6|t|t>>(t>>16))*10+((t>>11)&7)"],
  [8000, "(t%(t/(t>>9|t>>13)))"],
  [8000, "(t*(t>>5|t>>8))>>(t>>16)"],
  [8000, "t*((t>>9|t>>13)&25&t>>6)"],
  [8000, "t*(t>>11&t>>8&123&t>>3)"],
  [8000, "(t*(t>>8*(t>>15|t>>8)&(20|(t>>19)*5>>t|t>>3)))"],
  [8000, "((-t&4095)*(255&t*(t&t>>13))>>12)+(127&t*(234&t>>8&t>>3)>>(3&t>>14))"],
  [8000, "t*(t>>((t>>9|t>>8))&63&t>>4)"],
  [8000, "(t|(t>>9|t>>7))*t&(t>>11|t>>9)"],
  [8000, "t*t&(t>>7)|t*3&(t*4>>10)"],
  [8000, "(t>>7|t|t>>6)*10+4*(t&t>>13|t>>6)"],
  [8000, "((t&4096)?((t*(t^t%255)|(t>>4))>>1):(t>>3)|((t&8192)?t<<2:t))"],
  [8000, "((t*(t>>8|t>>9)&46&t>>8))^(t&t>>13|t>>6)"],
  [8000, "v=(v>>1)+(v>>4)+t*(((t>>16)|(t>>6))&(69&(t>>9)))"],
  [8000, "t*((t>>3|t>>9)&82&t>>9)"],
  [8000, "(t*t*t)>>t"],
  [8000, "t*((t+13217)/1211)&(t>>2|t>>4|t>>6)/512"],
  [
    8000,
    "((1-(((t+10)>>((t>>9)&15))&2))*2)*((((t)>>10)^((t+20)>>10))&1)*32+(((t&4095)-2047)*((t/((t>>10&3)+1))&((t>>10&7)+5))+(t>>(((t>>12)+16)&25)&1)*t%512*(t%256-128)/2)/1024+128",
  ],
  [8000, "((1-(((t+10)>>((t>>9)&((t>>14))))&(t>>4&-2)))*2)*(((t>>10)^((t+((t>>6)&127))>>10))&1)*32+128"],
  [8000, "16 * t*t* (t >>11)/7"],
  [8000, "t>>6^t&37|t+(t^t>>11) -t*((t%24?2:6)&t>>11)^t<<1 &(t&598?t>>4:t>>10)"],
  [
    8000,
    "(t<65536)?((2*t*(t>>11)&(t-1)|(t>>4)-1)%64):(((t%98304)>65536)?((17*t*(2*t>>8)&(t-1)|(t>>6)-1)%64|(t>>4)):((15*t*(2*t>>16)&(t-1)|(t>>8)-1)%64|(t>>4)))",
  ],
  [8000, "(t/10000000*t*t+t)%127|t>>3"],
  [8000, "(t|t>>5)&(t|t>>13)-(t|t>>21)"],
  [8000, "(t/((t>>16|t>>8))&((t>>5|t>>11)))-1|t*((t>>16|t>>8))"],
  [8000, "(t&t%255)-(t*3&t>>13&t>>6)"],
  [8000, "t>>4|t&(t>>5)/(t>>7-(t>>15)&-t>>7-(t>>15))"],
  [44100, '((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)'],
  [8000, "(t*9&t>>4|t*5&t>>7|t*3&t/1024)-1"],
  [8000, "t*(t^t+(t>>15|1)^(t-1280^t)>>10)"],
  [32000, '(3e3/(y=t&16383)&1)*35+(x=t*"6689"[t>>16&3]/24&127)*y/4e4+((t>>8^t>>10|t>>14|x)&63)'],
];

const sampleRates = createListCollection({
  items: [
    { label: "8000 Hz", value: 8000 },
    { label: "16000 Hz", value: 16000 },
    { label: "32000 Hz", value: 32000 },
    { label: "44100 Hz", value: 44100 },
  ],
});

type Item<T> = {
  label: string;
  value: T;
};

export function AlgoForm({ sampleRate = 8000, algorithm = "", onUpdate }: FormProps) {
  const [formData, setFormData] = useState<FormData>({ sampleRate, algorithm });

  const handleSampleRateChange = useCallback(
    (details: SelectValueChangeDetails<Item<number>>) => {
      const sampleRate = details.items[0].value;
      setFormData((prev) => ({ ...prev, sampleRate }));
      onUpdate({ ...formData, sampleRate });
    },
    [formData, setFormData, onUpdate]
  );

  const handleAlgorithmChange = useCallback(
    (details: SelectValueChangeDetails<Item<FormData>>) => {
      setFormData(details.items[0].value);
      onUpdate(details.items[0].value);
    },
    [formData, setFormData, onUpdate]
  );

  const { contains } = useFilter({ sensitivity: "base" });

  const { collection: algorithmCollection, filter } = useListCollection({
    initialItems: choices.map(([sampleRate, algorithm]) => ({
      label: algorithm,
      value: { sampleRate, algorithm },
    })),
    // filter: contains,
  });

  return (
    <form>
      <Flex gap={2}>
        <Field.Root flexBasis="110px" flexShrink={0}>
          <Select.Root
            size="sm"
            collection={sampleRates}
            defaultValue={[`8000 Hz`]}
            onValueChange={handleSampleRateChange}
          >
            <Select.HiddenSelect />

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
              <Select.Content>
                <For each={sampleRates.items}>
                  {(sampleRate) => (
                    <Select.Item key={sampleRate.value} item={sampleRate}>
                      {sampleRate.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  )}
                </For>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Field.Root>

        <Field.Root flex={1}>
          <Combobox.Root
            size="sm"
            width="full"
            collection={algorithmCollection}
            onValueChange={handleAlgorithmChange}
            // onInputValueChange={(e) => filter(e.inputValue)}
          >
            <Combobox.Control>
              <Combobox.Input placeholder="Type to search" />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner>
                <Combobox.Content>
                  <Combobox.Empty>No items found</Combobox.Empty>
                  {algorithmCollection.items.map((item) => (
                    <Combobox.Item item={item} key={item.value.algorithm}>
                      {item.label}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
          {/* <Field.ErrorText>{form.errors.algorithm}</Field.ErrorText> */}
        </Field.Root>
      </Flex>
    </form>
  );
}
