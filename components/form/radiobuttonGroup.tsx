import type { Classes, FormFieldProps, Option } from './types';

const baseClasses: { [key in keyof Classes]?: string } = {
  classes: 'absolute left-[5px] top-[5px] h-1.5 w-1.5 rounded-full bg-white',
  controlClasses: 'h-4 w-4 min-w-4 rounded-krc-radiobuttonGroup relative',
  wrapperClasses: 'flex flex-col gap-2',
  classesFilled: 'bg-primary-600',
  labelClasses: 'text-sm font-medium text-secondary-900',
  labelWrapperClasses: 'flex flex-row items-center gap-2',
  classesEmpty: 'border border-secondary-300 bg-white',
  errorClasses: 'text-sm text-error-500',
  optionClasses: 'text-sm',
};

export default function RadioButtonGroup<DataType>({
  classes = baseClasses.classes,
  controlClasses = baseClasses.controlClasses,
  optionClasses = baseClasses.optionClasses,
  labelClasses = baseClasses.labelClasses,
  classesFilled = baseClasses.classesFilled,
  classesEmpty = baseClasses.classesEmpty,
  wrapperClasses = baseClasses.wrapperClasses,
  labelWrapperClasses = baseClasses.labelWrapperClasses,
  errorClasses = baseClasses.errorClasses,
  options,
  error,
  required,
  value,
  label,
  name,
  arrangement = 'horizontal',
  onChange = () => {
    return;
  },
}: FormFieldProps<DataType> & { options: Option[] }) {
  return (
    <div className={wrapperClasses}>
      <span className={labelClasses}>
        {label} {required && '*'}
      </span>
      <div className={['flex gap-5', arrangement === 'vertical' ? 'flex-col' : 'flex-row'].join(' ')}>
        {options.map((option, i) => (
          <label key={i} className={labelWrapperClasses}>
            <div className={[controlClasses, value?.toString() === option.value.toString() ? classesFilled : classesEmpty].join(' ')}>
              <div className={classes}></div>
              <input
                className="appearance-none"
                type="radio"
                name={name as string}
                value={option.value.toString()}
                checked={value?.toString() === option.value.toString()}
                onChange={() => {
                  onChange(option.value);
                }}
              />
            </div>
            <span className={optionClasses}>{option.label}</span>
          </label>
        ))}
      </div>
      {!!error?.length && <span className={errorClasses}>{error}</span>}
    </div>
  );
}
