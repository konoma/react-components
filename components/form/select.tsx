import { useId } from 'react';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';

import type { Classes, FormFieldProps, FormValue, Option } from './types';

const CUSTOM_ENTRY_VALUE = 'CUSTOM_ENTRY_VALUE';

const baseClasses: { [key in keyof Classes]: string } = {
  classes: 'rounded-3xl h-10 py-0 border shadow-none',
  errorClasses: 'text-sm text-error-500',
  labelClasses: 'text-sm font-medium text-secondary-900',
  labelWrapperClasses: 'group flex flex-col gap-1',
  classesNeutral: 'border-secondary-300 group-hover:border-secondary-400',
  classesError: 'ring-error-500 ring-2',
  focusClasses: 'ring-2 ring-primary-900',
  controlClasses: 'h-8 rounded-3xl py-0 text-secondary-900 text-sm border-none outline-none',
  optionClasses: 'bg-white text-sm',
  optionSelectedClasses: 'bg-primary-500 text-sm',
  optionFocusedClasses: 'bg-white hover:bg-primary-200 text-sm',
  valueClasses: 'text-secondary-900 text-sm',
  placeholderClasses: 'text-secondary-500 text-sm',
  wrapperClasses: 'w-full h-auto',
  indicatorClasses: 'text-secondary-500',
  valueContainerClasses: '',
};

export default function Select<DataType>({
  classes = baseClasses.classes,
  errorClasses = baseClasses.errorClasses,
  labelClasses = baseClasses.labelClasses,
  labelWrapperClasses = baseClasses.labelWrapperClasses,
  classesNeutral = baseClasses.classesNeutral,
  classesError = baseClasses.classesError,
  focusClasses = baseClasses.focusClasses,
  controlClasses = baseClasses.controlClasses,
  optionClasses = baseClasses.optionClasses,
  optionSelectedClasses = baseClasses.optionSelectedClasses,
  optionFocusedClasses = baseClasses.optionFocusedClasses,
  valueClasses = baseClasses.valueClasses,
  placeholderClasses = baseClasses.placeholderClasses,
  wrapperClasses = baseClasses.wrapperClasses,
  indicatorClasses = baseClasses.indicatorClasses,
  valueContainerClasses = baseClasses.valueContainerClasses,
  options = [],
  placeholder = 'Bitte auswählen',
  className,
  required,
  error,
  defaultValue,
  searchable = false,
  label,
  name,
  isClearable = false,
  disabled,
  noValue,
  allowCustomValues,
  customValueLabel = 'Eigenen Wert hinzufügen',
  menuPortalTarget,
  isMulti,
  onInput = () => {
    return;
  },
  onKeyDown = () => {
    return;
  },
  onChange = () => {
    return;
  },
  ...props
}: FormFieldProps<DataType>) {
  const classesFull = [classes, className];
  const optionsInternal = options
    .filter((o) => !!o.value && o.value !== CUSTOM_ENTRY_VALUE)
    .concat(
      !allowCustomValues
        ? []
        : [
            { value: '', label: customValueLabel },
            { value: CUSTOM_ENTRY_VALUE, label: '' },
          ]
    );
  if (error && error.length > 0) {
    classesFull.push(classesError);
  } else {
    classesFull.push(classesNeutral);
  }
  let defaultOption;
  let key;
  if (isMulti) {
    defaultOption = defaultValue ? optionsInternal.filter((option) => option.value === defaultValue) : null;
    key = defaultOption?.map((option) => option.value.toString()).join('-') || name?.toString();
  } else {
    defaultOption = defaultValue ? optionsInternal.find((option) => option.value === defaultValue) : null;
    key = defaultOption?.value.toString() || name?.toString();
  }
  const Component = allowCustomValues ? CreatableSelect : ReactSelect;
  return (
    <>
      <label className={labelWrapperClasses}>
        {label && (
          <span className={labelClasses}>
            {label} {required && '*'}
          </span>
        )}
        <Component<FormValue, boolean>
          key={key}
          instanceId={useId()}
          classNamePrefix="select"
          className={wrapperClasses}
          isSearchable={searchable}
          menuPlacement="auto"
          isDisabled={disabled}
          name={name as string}
          classNames={{
            control: (state) => {
              if (state.isFocused) {
                return [...classesFull, focusClasses].join(' ');
              }
              return classesFull.join(' ');
            },
            valueContainer: () => {
              if (noValue) {
                if (valueContainerClasses) {
                  return ['hidden', valueContainerClasses].join(' ');
                }
                return 'hidden';
              }
              return valueContainerClasses || '';
            },
            input: () => controlClasses || '',
            indicatorSeparator: () => 'hidden',
            option: (state) => {
              if ((state.data as Option).value === CUSTOM_ENTRY_VALUE) {
                return 'hidden';
              }
              if (state.isSelected) {
                return optionSelectedClasses || '';
              } else if (state.isFocused) {
                return optionFocusedClasses || '';
              }
              return optionClasses || '';
            },
            singleValue: () => valueClasses || '',
            placeholder: () => placeholderClasses || '',
            dropdownIndicator: () => indicatorClasses || '',
          }}
          isClearable={isClearable}
          placeholder={placeholder}
          isMulti={isMulti}
          options={optionsInternal}
          closeMenuOnSelect={!isMulti}
          menuPortalTarget={menuPortalTarget}
          formatCreateLabel={(inputValue) => `${inputValue}`}
          noOptionsMessage={() => ''}
          onInputChange={(v) => onInput(v)}
          onKeyDown={onKeyDown}
          defaultValue={defaultOption}
          onCreateOption={(option) => {
            if (!option) {
              return;
            }
            onChange({ value: option, label: option } as FormValue);
          }}
          onChange={(option) => {
            if (!option) {
              return;
            }
            if (isMulti) {
              onChange(option as FormValue[]);
              return;
            } else {
              const properOption = option as Option;
              const cleanOption = {
                ...properOption,
                value: properOption.value || CUSTOM_ENTRY_VALUE,
                label: properOption.value ? properOption.label : ' ',
              };
              onChange(cleanOption as FormValue);
            }
          }}
          {...props}
        />
      </label>
      {error &&
        error.length > 0 &&
        error.map((e, i) => (
          <span key={i} className={errorClasses}>
            {e}
          </span>
        ))}
    </>
  );
}
