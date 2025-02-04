import { useEffect, useRef } from 'react';

import Icon from '../ui/icon';
import type { Classes, FormFieldProps } from './types';

const baseClasses: { [key in keyof Classes]?: string } = {
  classesFilled:
    'flex h-4 w-4 flex-row items-center justify-center rounded-krc-checkbox border border-primary-600 bg-primary-600 shadow outline-offset-2 group-hover:border-primary-700 group-hover:bg-primary-700',
  classesEmpty:
    'flex flex-row items-center justify-center h-4 w-4 rounded-krc-checkbox border border-secondary-300 bg-white shadow outline-offset-2 outline-primary-800 group-hover:border-secondary-400 group-active:outline',
  classesError: 'h-4 w-4 rounded-krc-checkbox border border-error-500 bg-error-100 shadow outline-offset-2',
  labelClassesFilled: 'ml-2 text-sm font-medium text-secondary-900',
  labelClassesError: 'ml-2 text-sm font-medium text-error-600',
  labelClassesEmpty: 'ml-2 text-sm font-medium text-secondary-900',
  iconClassesFilled: 'h-3 w-3 text-white',
};

export default function Checkbox<DataType>({
  classesFilled = baseClasses.classesFilled,
  classesError = baseClasses.classesError,
  classesEmpty = baseClasses.classesEmpty,
  labelClassesFilled = baseClasses.labelClassesFilled,
  labelClassesError = baseClasses.labelClassesError,
  labelClassesEmpty = baseClasses.labelClassesEmpty,
  iconClassesFilled = baseClasses.iconClassesFilled,
  value,
  defaultValue,
  /** UNUSED, only listed so that the typing for onInput does not clash with the onInput event of the input */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onInput = () => {
    return;
  },
  onChange = () => {
    return;
  },
  label,
  indeterminate,
  disabled,
  className = '',
  name,
  error,
  ...props
}: FormFieldProps<DataType>) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (indeterminate && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  });
  if (value || indeterminate) {
    return (
      <label className={`group flex flex-row items-center ${className}`}>
        <input type="hidden" value={1} />
        <input
          ref={ref}
          value={1}
          type="checkbox"
          name={name as string}
          className="h-0 w-0 appearance-none"
          defaultChecked={!!defaultValue}
          checked={!!value}
          onChange={(e) => onChange(e.target.checked, e)}
          disabled={disabled}
          {...props}
        />
        <div className={classesFilled}>
          <Icon name="heroicons:check-16-solid" className={iconClassesFilled} />
        </div>
        <span className={labelClassesFilled}>{label}</span>
      </label>
    );
  } else if (error?.length) {
    return (
      <label className={`group flex flex-row items-center ${className}`}>
        <input type="hidden" name={name as string} value={0} />
        <input
          ref={ref}
          type="checkbox"
          name={name as string}
          className="h-0 w-0 appearance-none"
          defaultChecked={!!defaultValue}
          onChange={(e) => onChange(e.target.checked, e)}
          disabled={disabled}
        />
        <div className={classesError}></div>
        <span className={labelClassesError}>{label}</span>
      </label>
    );
  } else {
    return (
      <label className={`group flex flex-row items-center ${className}`}>
        {/* This allows us to check for errors in CheckboxList */}
        <input type="hidden" name={name as string} value={0} />
        <input
          ref={ref}
          type="checkbox"
          name={name as string}
          value={0}
          className="h-0 w-0 appearance-none"
          defaultChecked={!!defaultValue}
          onChange={(e) => onChange(e.target.checked, e)}
          disabled={disabled}
        />
        <div className={classesEmpty}></div>
        <span className={labelClassesEmpty}>{label}</span>
      </label>
    );
  }
}
