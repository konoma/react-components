import type { Classes, FormFieldProps } from './types.ts';
import Tag from '../ui/tag.tsx';

const baseClasses: { [key in keyof Classes]?: string } = {
  classes: 'w-full flex flex-row gap-2 flex-wrap items-center rounded-krc-tag-list p-4 bg-white',
  wrapperClasses: 'group flex flex-col gap-1',
  labelClasses: 'flex flex-row justify-start text-sm font-medium text-secondary-900',
  iconLeftClasses: 'absolute bottom-0 left-3 top-0 my-auto h-5 w-5 text-secondary-300',
  iconRightClasses: 'absolute bottom-0 right-3 top-0 my-auto h-5 w-5 text-secondary-300',
  errorClasses: 'text-sm text-error-500',
  classesError: 'ring-error-500 ring-2',
  classesNeutral: 'border-secondary-300 border',
  additionalClassesIconLeft: 'pl-10',
  additionalClassesIconRight: 'pr-10',
};

export default function TagList<DataType>({
  classes = baseClasses.classes,
  wrapperClasses = baseClasses.wrapperClasses,
  labelClasses = baseClasses.labelClasses,
  errorClasses = baseClasses.errorClasses,
  classesError = baseClasses.classesError,
  classesNeutral = baseClasses.classesNeutral,
  disabled,
  label,
  error,
  required,
  values,
  dataTestId,
  addTagTitle = '',
  deleteIconName,
  deleteIconPath,
  addIconName,
  addIconPath,
  allowDelete = true,
  allowNew = true,
  onChange = () => {

  },
  className = '',
}: FormFieldProps<DataType>) {
  const classesFull = [classes];
  if (error && error.length > 0) {
    classesFull.push(classesError);
  } else {
    classesFull.push(classesNeutral);
  }
  classesFull.push(className);

  return (
    <label className={wrapperClasses}>
      {label && (
        <span className={labelClasses}>
          {label}
          {' '}
          {required && '*'}
        </span>
      )}

      <div className={classesFull.join(' ')}>
        {values?.map(value => (
          <Tag
            key={value.toString()}
            title={value.toString()}
            onClick={() => onChange(value)}
            iconRightName={!disabled && allowDelete ? deleteIconName || 'heroicons:x-mark-16-solid' : undefined}
            iconRightPath={!disabled && allowDelete ? deleteIconPath : undefined}
            data-testid={dataTestId}
          />
        ))}
        {!disabled && allowNew && (
          <Tag
            title={addTagTitle}
            iconLeftName={addIconName || 'heroicons:plus-16-solid'}
            iconLeftPath={addIconPath}
            wrapperClasses="flex flex-row h-6 cursor-pointer items-center justify-center gap-1 rounded-krc-tag-list-add border border-secondary-300 px-3 py-1 bg-white"
            onClick={() => onChange('')}
          />
        )}
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
