import { Icon } from '@iconify-icon/react';
import { useRef } from 'react';
import { IMaskInput } from 'react-imask';
import type { Classes, FormFieldProps } from './types';

const baseClasses: { [key in keyof Classes]?: string } = {
  classes:
    'w-full h-10 rounded-3xl px-3 py-2 outline-none placeholder:text-secondary-500 placeholder:text-sm text-secondary-900 text-sm disabled:pointer-events-none ',
  wrapperClasses: 'group flex flex-col gap-1',
  labelClasses: 'flex flex-row justify-start text-sm font-medium text-secondary-900',
  iconLeftClasses: 'absolute bottom-0 left-3 top-0 my-auto h-5 w-5 text-secondary-300',
  iconRightClasses: 'h-5 w-5',
  wrapperRightClasses: 'absolute bottom-0 right-3 top-0 my-auto flex flex-row items-center gap-2 text-secondary-300 text-sm',
  errorClasses: 'text-sm text-error-500',
  classesError: 'ring-error-500 ring-2',
  classesNeutral: 'border-secondary-300 border focus:ring-2 hover:border-secondary-400 focus:ring-primary-900',
  additionalClassesIconLeft: 'pl-10',
  additionalClassesIconRight: 'pr-12',
};

export default function Input<DataType>({
  classes = baseClasses.classes,
  wrapperClasses = baseClasses.wrapperClasses,
  labelClasses = baseClasses.labelClasses,
  iconLeftClasses = baseClasses.iconLeftClasses,
  iconRightClasses = baseClasses.iconRightClasses,
  errorClasses = baseClasses.errorClasses,
  classesError = baseClasses.classesError,
  classesNeutral = baseClasses.classesNeutral,
  additionalClassesIconLeft = baseClasses.additionalClassesIconLeft,
  additionalClassesIconRight = baseClasses.additionalClassesIconRight,
  wrapperRightClasses = baseClasses.wrapperRightClasses,
  label,
  iconLeft,
  iconRight,
  textRight,
  centered,
  error,
  required,
  name,
  value,
  mask,
  defaultValue,
  placeholder,
  className = '',
  onIconRightClick = () => {
    return;
  },
  onChange = () => {
    return;
  },
  onClick = () => {
    return;
  },
  onKeyDown = () => {
    return;
  },
  onBlur = () => {
    return;
  },
  ...props
}: FormFieldProps<DataType>) {
  const classesFull = [classes];
  if (iconLeft) {
    classesFull.push(additionalClassesIconLeft);
  }
  if (iconRight || textRight) {
    classesFull.push(additionalClassesIconRight);
  }
  if (centered) {
    classesFull.push('text-center');
  }
  if (error && error.length > 0) {
    classesFull.push(classesError);
  } else {
    classesFull.push(classesNeutral);
  }
  classesFull.push(className);

  const ref = useRef<HTMLInputElement>(null);
  const inputRef = useRef(null);
  return (
    <label className={wrapperClasses}>
      {label && (
        <span className={labelClasses}>
          {label} {required && '*'}
        </span>
      )}

      <div className="relative">
        {mask ? (
          <IMaskInput
            mask={mask}
            radix="."
            unmask={true}
            ref={ref}
            inputRef={inputRef}
            placeholder={placeholder}
            value={value?.toString()}
            defaultValue={defaultValue?.toString()}
            {...props}
            onInput={(e) => {
              onChange(e.currentTarget.value);
            }}
            onClick={(e) => {
              ref.current?.showPicker?.();
              onClick(e);
            }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={classesFull.join(' ')}
            name={name as string}
          />
        ) : (
          <input
            {...props}
            ref={ref}
            placeholder={placeholder}
            value={value?.toString()}
            defaultValue={defaultValue?.toString()}
            onInput={(e) => {
              onChange(e.currentTarget.value);
            }}
            onClick={(e) => {
              ref.current?.showPicker();
              onClick(e);
            }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={classesFull.join(' ')}
            name={name as string}
          />
        )}
        {iconLeft && <Icon className={iconLeftClasses} icon={iconLeft} />}
        {iconRight || textRight ? (
          <div className={wrapperRightClasses}>
            {textRight && <span>{textRight}</span>}
            {iconRight && <Icon className={iconRightClasses} icon={iconRight} onClick={onIconRightClick} />}
          </div>
        ) : null}
      </div>
      {error &&
        error.length > 0 &&
        error.map((e, i) => (
          <span key={i} className={errorClasses}>
            {e}
          </span>
        ))}
    </label>
  );
}
