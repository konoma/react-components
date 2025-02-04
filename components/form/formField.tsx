import { useContext } from 'react';

import Checkbox from './checkbox';
import CheckboxList from './checkboxList';
import { ErrorContext } from './form';
import Input from './input';
import PhoneInput from './phoneInput';
import RadioButtonGroup from './radiobuttonGroup';
import Select from './select';
import SelectWithNew from './selectWithNew';
import TagList from './tagList';
import Textarea from './textarea';
import type { FormFieldProps, FormValue } from './types';

const FormFieldComponents = {
  checkbox: Checkbox,
  checkboxList: CheckboxList,
  input: Input,
  radioButtonGroup: RadioButtonGroup,
  select: Select,
  textarea: Textarea,
  tagList: TagList,
  phoneInput: PhoneInput,
  // TODO: Add the new component
  selectWithNew: SelectWithNew,
};

export default function FormField<DataType>({
  component,
  value,
  defaultValue,
  name,
  options = [],
  onChange = () => {
    return;
  },
  ...props
}: FormFieldProps<DataType> & { component: keyof typeof FormFieldComponents }) {
  const Component = FormFieldComponents[component];
  const { errors } = useContext(ErrorContext);
  return (
    <Component<DataType>
      error={errors[name as string]}
      {...props}
      value={value}
      defaultValue={defaultValue}
      onChange={(v: FormValue | FormValue[], e) => {
        onChange(v, e);
      }}
      options={options}
      name={name}
    />
  );
}
