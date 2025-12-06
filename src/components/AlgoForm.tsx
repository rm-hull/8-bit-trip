import { Flex, FormControl, Input, Select } from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";

export type FormData = {
  sampleRate: number;
  algorithm: string;
};

type FormProps = Partial<FormData> & {
  onUpdate(form: FormData): void;
};

export default function AlgoForm({ sampleRate, algorithm, onUpdate }: FormProps) {
  const handleUpdate = (form: FormData, actions: FormikHelpers<FormData>) => {
    onUpdate(form);
    actions.setSubmitting(false);
  };
  return (
    <Formik initialValues={{ sampleRate: sampleRate ?? 8000, algorithm: algorithm ?? "" }} onSubmit={handleUpdate}>
      {() => (
        <Form>
          <Flex>
            <Field name="sampleRate">
              {({ field, form }: FieldProps) => (
                <FormControl
                  flex={0.1}
                  mr={2}
                  isInvalid={form.errors.sampleRate !== undefined && !!form.touched.sampleRate}
                >
                  <Select {...field} size="sm" onBlur={form.submitForm}>
                    <option value={8000}>8000 Hz</option>
                    <option value={16000}>16000 Hz</option>
                    <option value={32000}>32000 Hz</option>
                    <option value={44100}>44100 Hz</option>
                  </Select>
                  {/* <FormErrorMessage>{form.errors.sampleRate}</FormErrorMessage> */}
                </FormControl>
              )}
            </Field>
            <Field name="algorithm">
              {({ field, form }: FieldProps) => (
                <FormControl flex={1} isInvalid={form.errors.sampleRate !== undefined && !!form.touched.sampleRate}>
                  <Input {...field} size="sm" onBlur={form.submitForm} />
                  {/* <FormErrorMessage>{form.errors.algorithm}</FormErrorMessage> */}
                </FormControl>
              )}
            </Field>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
