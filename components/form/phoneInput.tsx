import { useCallback, useRef, useState } from 'react';
import { IMaskInput } from 'react-imask';

import Select from './select';
import type { Classes, FormFieldProps, FormValue } from './types';

const baseClasses: { [key in keyof Classes]?: string } = {
  classes:
    'w-full h-10 rounded-3xl rounded-l-none px-3 py-2 outline-none placeholder:text-secondary-500 placeholder:text-sm text-secondary-900 text-sm disabled:pointer-events-none ',
  wrapperClasses: 'group flex flex-col gap-1',
  labelClasses: 'flex flex-row justify-start text-sm font-medium text-secondary-900',
  wrapperLeftClasses: 'absolute bottom-0 left-3 top-0 my-auto h-5 w-5 text-sm text-secondary-900',
  iconRightClasses: 'h-5 w-5',
  wrapperRightClasses: 'absolute bottom-0 right-3 top-0 my-auto flex flex-row items-center gap-2 text-secondary-300 text-sm',
  errorClasses: 'text-sm text-error-500',
  classesError: 'ring-error-500 ring-2',
  classesNeutral: 'border-secondary-300 border focus:ring-2 hover:border-secondary-400 focus:ring-primary-900',
  additionalClassesIconRight: 'pr-12',
};

interface CountryCode {
  value: string;
  label: string;
}

const countryCodes: CountryCode[] = [
  { value: '+41', label: 'CH' },
  { value: '+49', label: 'DE' },
  { value: '+33', label: 'FR' },
  { value: '+39', label: 'IT' },
  { value: '+43', label: 'AT' },
  { value: '+423', label: 'LI' },
];

const placeholders: Record<string, string> = {
  CH: '44 123 45 67',
  DE: '1234567',
  FR: '1234567',
  IT: '1234567',
  AT: '1234567',
  LI: '1234567',
};

const masks: Record<string, string> = {
  CH: '00{ }000{ }00{ }00{ }00{ }00',
};

export default function PhoneInput<DataType>({
  classes = baseClasses.classes,
  wrapperClasses = baseClasses.wrapperClasses,
  labelClasses = baseClasses.labelClasses,
  wrapperLeftClasses = baseClasses.wrapperLeftClasses,
  errorClasses = baseClasses.errorClasses,
  classesError = baseClasses.classesError,
  classesNeutral = baseClasses.classesNeutral,
  additionalClassesIconRight = baseClasses.additionalClassesIconRight,
  label,
  iconRight,
  textRight,
  centered,
  error,
  required,
  name,
  value,
  defaultValue,
  className = '',
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

  const [internalValue, setInternalValue] = useState<string>(() => {
    const stringValue = value?.toString();
    if (stringValue?.startsWith('+')) {
      for (const code of countryCodes) {
        if (stringValue.startsWith(code.value)) {
          return stringValue.slice(code.value.length).trim();
        }
      }
    }
    return stringValue?.trim() || '';
  });

  const [countryCode, setCountryCode] = useState<CountryCode>(() => {
    const stringValue = value?.toString();
    if (stringValue?.startsWith('+')) {
      for (const code of countryCodes) {
        if (stringValue.startsWith(code.value) || stringValue.startsWith(code.value.replace('+', '00'))) {
          return code;
        }
      }
    }
    return { value: '+41', label: 'CH' };
  });

  const onChangeInternal = useCallback(
    (newValue = internalValue, newCountryCode = countryCode) => {
      if (!newValue.startsWith(' ')) {
        onChange(newCountryCode.value + ' ' + newValue);
      } else {
        onChange(newCountryCode.value + newValue);
      }
    },
    [countryCode, internalValue, onChange]
  );

  const ref = useRef<HTMLInputElement>(null);
  return (
    <label className={wrapperClasses} htmlFor={name as string}>
      {label && (
        <span className={labelClasses}>
          {label} {required && '*'}
        </span>
      )}
      <div className="flex flex-row">
        <Select
          className="w-[4.5rem] rounded-r-none"
          valueClasses="text-secondary-900 text-sm pl-1 pr-0"
          valueContainerClasses="pr-0"
          indicatorClasses="text-secondary-500 pl-0"
          options={countryCodes}
          defaultValue={countryCode}
          value={countryCode}
          onChange={(v: FormValue | FormValue[]) => {
            setCountryCode(v as CountryCode);
            onChangeInternal(internalValue, v as CountryCode);
          }}
        />
        <div className="relative flex grow flex-row">
          <IMaskInput
            {...props}
            mask={masks[countryCode.label]}
            radix="."
            unmask={true}
            ref={ref}
            id={name as string}
            placeholder={placeholders[countryCode.label]}
            value={internalValue}
            defaultValue={defaultValue?.toString()}
            onInput={(e) => {
              setInternalValue(e.currentTarget.value);
              onChangeInternal(e.currentTarget.value);
            }}
            onClick={(e) => {
              onClick(e);
            }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={classesFull.concat(countryCode.value.length === 3 ? 'pl-[2.75rem]' : 'pl-[3.25rem]').join(' ')}
            name={name as string}
          />
          <div className={wrapperLeftClasses}>{countryCode.value}</div>
        </div>
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
