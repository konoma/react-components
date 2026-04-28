import type { FormFieldProps, FormValue } from './types.ts';

import { use } from 'react';
import Checkbox from './checkbox.tsx';
import CheckboxList from './checkboxList.tsx';
import { ErrorContext } from './ErrorContext.ts';
import Input from './input.tsx';
import PhoneInput from './phoneInput.tsx';
import RadioButtonGroup from './radiobuttonGroup.tsx';
import Select from './select.tsx';
import TagList from './tagList.tsx';
import Textarea from './textarea.tsx';

const FormFieldComponents = {
  checkbox: Checkbox,
  checkboxList: CheckboxList,
  input: Input,
  radioButtonGroup: RadioButtonGroup,
  select: Select,
  textarea: Textarea,
  tagList: TagList,
  phoneInput: PhoneInput,
};

export default function FormField<DataType>({
  component,
  value,
  defaultValue,
  name,
  options = [],
  onChange = () => {

  },
  ...props
}: FormFieldProps<DataType> & { component: keyof typeof FormFieldComponents }) {
  const Component = FormFieldComponents[component];
  const { errors } = use(ErrorContext);
  return (
    <Component<DataType>
      error={errors[name as string]}
      {...props}
      value={value}
      defaultValue={defaultValue}
      onChange={(v: FormValue | FormValue[], e?: React.ChangeEvent) => {
        if (typeof v === 'string') {
          // replace non-breaking spaces with regular spaces
          v = v.replaceAll('\u00A0', ' ');
        }
        onChange(v, e);
      }}
      options={options}
      name={name}
    />
  );
}
