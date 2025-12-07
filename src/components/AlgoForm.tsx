import { Flex, Field as ChakraField, Input, NativeSelect } from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { useCallback } from "react";

export type FormData = {
  sampleRate: number;
  algorithm: string;
};

type FormProps = Partial<FormData> & {
  onUpdate: (form: FormData) => void;
};

export function AlgoForm({ sampleRate, algorithm, onUpdate }: FormProps) {
  const handleUpdate = useCallback(
    (form: FormData, actions: FormikHelpers<FormData>) => {
      console.log({form})
      onUpdate(form);
      actions.setSubmitting(false);
    },
    [onUpdate]
  );

  return (
    <Formik initialValues={{ sampleRate: sampleRate ?? 8000, algorithm: algorithm ?? "" }} onSubmit={handleUpdate}>
      {() => (
        <Form>
          <Flex gap={2}>
            <Field name="sampleRate">
              {({ field, form }: FieldProps) => (
                <ChakraField.Root
                  flex={0.1}
                  invalid={form.errors.sampleRate !== undefined && !!form.touched.sampleRate}
                >
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field {...field} onBlur={form.submitForm}>
                      <option value={8000}>8000 Hz</option>
                      <option value={16000}>16000 Hz</option>
                      <option value={32000}>32000 Hz</option>
                      <option value={44100}>44100 Hz</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                  {/* <ChakraField.ErrorText>{form.errors.sampleRate}</ChakraField.ErrorText> */}
                </ChakraField.Root>
              )}
            </Field>
            <Field name="algorithm">
              {({ field, form }: FieldProps) => (
                <ChakraField.Root flex={1} invalid={form.errors.algorithm !== undefined && !!form.touched.algorithm}>
                  <Input {...field} size="sm" onBlur={form.submitForm} />
                  {/* <ChakraField.ErrorText>{form.errors.algorithm}</ChakraField.ErrorText> */}
                </ChakraField.Root>
              )}
            </Field>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
