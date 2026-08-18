import type { Classes, FormFieldProps } from './types.ts';
import { useEffect, useRef } from 'react';

import { IMaskInput } from 'react-imask';
import Icon from '../ui/icon.tsx';
import LoadingIndicator from '../ui/loadingIndicator.tsx';

const baseClasses: { [key in keyof Classes]?: string } = {
  controlClasses:
    'w-full h-10 rounded-krc-input px-3 py-2 outline-hidden placeholder:text-secondary-500 placeholder:text-sm text-secondary-900 text-sm disabled:pointer-events-none not-disabled:bg-white disabled:bg-secondary-50 disabled:text-secondary-900',
  wrapperClasses: 'group flex flex-col gap-1',
  labelClasses: 'flex flex-row justify-start text-sm font-medium text-secondary-900',
  iconLeftClasses: 'absolute bottom-0 left-3 top-0 my-auto h-5 w-5 text-secondary-300',
  iconRightClasses: 'h-5 w-5',
  wrapperRightClasses: 'absolute right-3 top-0 my-auto flex flex-row items-center gap-2 text-secondary-300 text-sm h-10',
  errorClasses: 'text-sm text-error-500',
  classesError: 'ring-error-500 ring-2',
  classesNeutral:
    'border-secondary-300 border focus:not-disabled:ring-2 hover:not-disabled:border-secondary-400 focus:not-disabled:ring-primary-900',
  additionalClassesIconLeft: 'pl-10',
  additionalClassesIconRight: 'pr-12',
  classes: 'relative h-14',
  loadingClassesBase: 'h-6 w-6 absolute top-2 right-2.5 animate-spin text-primary-600 fill-white',
};

export default function Input<DataType>({
  controlClasses = baseClasses.controlClasses,
  wrapperClasses = baseClasses.wrapperClasses,
  labelClasses = baseClasses.labelClasses,
  iconLeftClasses = baseClasses.iconLeftClasses,
  iconRightClasses = baseClasses.iconRightClasses,
  errorClasses = baseClasses.errorClasses,
  classesError = baseClasses.classesError,
  classesNeutral = baseClasses.classesNeutral,
  classes = baseClasses.classes,
  additionalClassesIconLeft = baseClasses.additionalClassesIconLeft,
  additionalClassesIconRight = baseClasses.additionalClassesIconRight,
  wrapperRightClasses = baseClasses.wrapperRightClasses,
  loadingClassesBase = baseClasses.loadingClassesBase,
  label,
  iconLeftPath,
  iconLeftName,
  iconRightPath,
  iconRightName,
  textRight,
  centered,
  error,
  step,
  required,
  loading,
  name,
  value,
  mask,
  defaultValue,
  placeholder,
  autoFocus,
  className = '',
  dataTestId,
  onIconRightClick = () => {

  },
  onIconLeftClick = () => {

  },
  onChange = () => {

  },
  onClick = () => {

  },
  onKeyDown = () => {

  },
  onBlur = () => {

  },
  ...props
}: Readonly<FormFieldProps<DataType>>) {
  const classesFull = [controlClasses];
  if (iconLeftPath || iconLeftName) {
    classesFull.push(additionalClassesIconLeft);
  }
  if (iconRightPath || iconRightName || textRight) {
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

  const loadingClasses = [loadingClassesBase];

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (autoFocus) {
      timeout = setTimeout(() => {
        ref.current?.focus();
      }, 100);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [autoFocus]);

  const inputRef = useRef(null);
  return (
    <label className={wrapperClasses}>
      {label && (
        <span className={labelClasses}>
          {label}
          {' '}
          {required && '*'}
        </span>
      )}

      <div className={classes}>
        {mask
          ? (
              <IMaskInput
                mask={mask}
                radix="."
                unmask={true}
                ref={ref}
                step={step}
                data-testid={dataTestId}
                inputRef={inputRef}
                placeholder={placeholder}
                value={value?.toString()}
                defaultValue={defaultValue?.toString()}
                {...props}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(e.currentTarget.value);
                }}
                onClick={(e: React.MouseEvent) => {
                  if (e.isTrusted) {
                    ref.current?.showPicker?.();
                  }
                  onClick(e);
                }}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={classesFull.join(' ')}
                name={name as string}
              />
            )
          : (
              <input
                {...props}
                ref={ref}
                placeholder={placeholder}
                data-testid={dataTestId}
                // We do not want to use a fallback to an empty string here, as it would always overwrite the defaultValue
                value={value?.toString()}
                defaultValue={defaultValue?.toString() === undefined ? '' : defaultValue?.toString()}
                onInput={(e) => {
                  onChange(e.currentTarget.value);
                }}
                onClick={(e) => {
                  if (e.isTrusted) {
                    ref.current?.showPicker?.();
                  }
                  onClick(e);
                }}
                step={step}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={classesFull.join(' ')}
                name={name as string}
              />
            )}
        {(iconLeftPath || iconLeftName) && (
          <Icon className={iconLeftClasses} name={iconLeftName} path={iconLeftPath} onClick={onIconLeftClick} />
        )}
        {iconRightPath || iconRightName || textRight
          ? (
              <div className={wrapperRightClasses}>
                {textRight && <span>{textRight}</span>}
                {(iconRightPath || iconRightName) && (
                  <Icon className={iconRightClasses} name={iconRightName} path={iconRightPath} onClick={onIconRightClick} />
                )}
              </div>
            )
          : null}
        {loading && <LoadingIndicator className={loadingClasses.join(' ')} />}
      </div>
      {error
        && error.length > 0
        && error.map(e => (
          <span key={e} className={errorClasses}>
            {e}
          </span>
        ))}
    </label>
  );
}
