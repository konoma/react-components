import Checkbox from './checkbox';
import type { Classes, FormFieldProps } from './types';
import { positionClasses } from './types';

const baseClasses: { [key in keyof Classes]?: string } = {
  labelClasses: 'text-sm font-medium text-secondary-900',
  wrapperClasses: 'flex gap-4',
  classes: 'flex flex-row gap-5',
  classesError: '!text-error-500',
  errorClasses: 'text-sm text-error-500',
};

export default function CheckboxList<DataType>({
  labelClasses = baseClasses.labelClasses,
  wrapperClasses = baseClasses.wrapperClasses,
  classes = baseClasses.classes,
  classesError = baseClasses.classesError,
  errorClasses = baseClasses.errorClasses,
  childClasses = {},
  label,
  error,
  name,
  options = [],
  required,
  labelPosition = 'top',
  values = [],
  onChange = () => {
    return;
  },
}: FormFieldProps<DataType>) {
  return (
    <div className={[wrapperClasses, positionClasses[labelPosition]].join(' ')}>
      <span className={labelClasses}>
        {label} {required && '*'}
      </span>
      <div className={[classes, error?.length && { classesError }].join(' ')}>
        {options.map((option, i) => {
          return (
            <Checkbox
              key={i}
              name={name as string}
              label={option.label.toString()}
              error={error}
              {...childClasses}
              value={values.includes(option.value)}
              onChange={(_, e) => onChange(option.value, e)}
            />
          );
        })}
      </div>
      {!!error?.length && <span className={errorClasses}>{error}</span>}
    </div>
  );
}
