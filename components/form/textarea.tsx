import { Icon } from '@iconify-icon/react';
import { Resizable } from 're-resizable';
import { useMemo, useRef, useState } from 'react';

import type { Classes, FormFieldProps } from './types';

const baseClasses: { [key in keyof Classes]?: string } = {
  classes: 'w-full bg-white text-sm cursor-text rounded-krc-textarea p-4 text-secondary-900',
  classesNeutral: 'border border-secondary-300 has-[:focus]:ring-2 hover:border-secondary-400 has-[:focus]:ring-primary-900',
  classesError: 'ring-error-500 ring-2',
  errorClasses: 'text-sm text-error-500',
  labelClasses: 'flex flex-row justify-start text-sm text-secondary-900 font-medium',
  hintClasses: 'text-sm text-secondary-500',
  wrapperClasses: 'flex flex-col gap-1',
  resizeClasses: 'absolute bottom-4 right-4 h-4 w-4 cursor-row-resize text-secondary-300',
  resizeIconClasses: 'h-4 w-4',
  controlClasses: 'h-full w-full resize-none focus-visible:outline-none disabled:pointer-events-none  disabled:bg-primary-50',
  labelWrapperClasses: 'flex flex-row justify-between',
  classesDisabled: 'w-full text-sm rounded-krc-textarea p-4 pointer-events-none bg-primary-50',
};

export default function Textarea<DataType>({
  classes = baseClasses.classes,
  classesNeutral = baseClasses.classesNeutral,
  classesError = baseClasses.classesError,
  errorClasses = baseClasses.errorClasses,
  labelClasses = baseClasses.labelClasses,
  hintClasses = baseClasses.hintClasses,
  wrapperClasses = baseClasses.wrapperClasses,
  resizeClasses = baseClasses.resizeClasses,
  resizeIconClasses = baseClasses.resizeIconClasses,
  controlClasses = baseClasses.controlClasses,
  labelWrapperClasses = baseClasses.labelWrapperClasses,
  classesDisabled = baseClasses.classesDisabled,
  resizeIcon,
  label,
  error,
  required,
  initialHeight = 100,
  maxLength = 150,
  replacements,
  name,
  value,
  disabled,
  defaultValue,
  maxLengthLabel,
  /** UNUSED, only listed so that the typing for onInput does not clash with the onInput event of the textarea */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onInput = () => {
    return;
  },
  onChange = () => {
    return;
  },
  ...props
}: FormFieldProps<DataType>) {
  const [height] = useState(initialHeight);
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const classesFull = [];

  if (disabled) {
    classesFull.push(classesDisabled);
  } else {
    classesFull.push(classes);
  }
  const [isFocused, setIsFocused] = useState(false);

  const text = useMemo(() => {
    let t = value?.toString() || '';
    if (!isFocused) {
      if (!replacements) {
        return t;
      }
      Object.entries(replacements).forEach(([key, value]) => {
        t = t.replace(new RegExp(`{${key}}`, 'g'), value);
      });
    }
    return t;
  }, [isFocused, replacements, value]);

  if (error && error.length > 0) {
    classesFull.push(classesError);
  } else {
    classesFull.push(classesNeutral);
  }

  return (
    <label className={wrapperClasses}>
      <div className={labelWrapperClasses}>
        {label && (
          <span className={labelClasses}>
            {label} {required && '*'}
          </span>
        )}
        {!!maxLength && <span className={hintClasses}>{maxLengthLabel}</span>}
      </div>

      <div className="relative">
        <Resizable
          defaultSize={{ height }}
          className={classesFull.join(' ')}
          enable={{ bottom: true }}
          handleComponent={
            resizeIcon
              ? {
                  bottom: (
                    <div className={resizeClasses} draggable={true}>
                      <Icon icon={resizeIcon} className={resizeIconClasses} />
                    </div>
                  ),
                }
              : {}
          }
        >
          <textarea
            maxLength={maxLength || undefined}
            ref={textarea}
            value={text}
            disabled={disabled}
            defaultValue={defaultValue?.toString()}
            onInput={(e) => onChange(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            name={name as string}
            className={controlClasses}
            {...props}
          />
        </Resizable>
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
