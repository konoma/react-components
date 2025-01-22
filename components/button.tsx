import type { IconName } from './icon';
import { Icon } from './icon';
import LoadingIndicator from './loadingIndicator';
import type { MouseEvent } from 'react';

const baseClasses = {
  classesBase:
    'w-full rounded-3xl py-2.5 px-3.5 h-10 text-sm font-semibold shadow inline-flex justify-center items-center flex flex-row gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:ring-0 disabled:bg-secondary-200 disabled:text-secondary-500',
  classesPrimary:
    'bg-primary-600 border border-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
  classesSecondary: 'bg-white border border-secondary-200 hover:bg-secondary-50 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
  classesActiveSecondary:
    'bg-secondary-100 border border-secondary-100 hover:bg-secondary-200 text-secondary-900 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
  classesError: 'bg-error-500 border border-error-600 text-white hover:bg-error-700 focus:ring-2 focus:ring-error-500 focus:ring-offset-2',
  classesAlert: 'bg-alert-500 border border-alert-600 text-white hover:bg-alert-700 focus:ring-2 focus:ring-alert-500 focus:ring-offset-2',
  loadingClassesBase: 'h-6 w-6 animate-spin',
  loadingClassesPrimary: 'text-primary-600 fill-white',
  loadingClassesSecondary: 'text-secondary-200',
  loadingClassesActiveSecondary: 'text-secondary-200',
  loadingClassesError: 'text-error-200',
  loadingClassesAlert: 'text-alert-200',
  iconLeftClasses: 'h-6 w-6',
  iconRightClasses: 'h-6 w-6',
};

export default function Button({
  className = '',
  classesBase = baseClasses.classesBase,
  classesPrimary = baseClasses.classesPrimary,
  classesSecondary = baseClasses.classesSecondary,
  classesActiveSecondary = baseClasses.classesActiveSecondary,
  classesError = baseClasses.classesError,
  classesAlert = baseClasses.classesAlert,
  loadingClassesBase = baseClasses.loadingClassesBase,
  loadingClassesPrimary = baseClasses.loadingClassesPrimary,
  loadingClassesSecondary = baseClasses.loadingClassesSecondary,
  loadingClassesActiveSecondary = baseClasses.loadingClassesActiveSecondary,
  loadingClassesError = baseClasses.loadingClassesError,
  loadingClassesAlert = baseClasses.loadingClassesAlert,
  iconLeftClasses = baseClasses.iconLeftClasses,
  iconRightClasses = baseClasses.iconRightClasses,
  type = 'button',
  variant,
  label,
  loading,
  disabled,
  iconLeft,
  iconRight,
  onClick,
}: {
  classesBase?: string;
  classesPrimary?: string;
  classesSecondary?: string;
  classesActiveSecondary?: string;
  classesError?: string;
  classesAlert?: string;
  loadingClassesBase?: string;
  loadingClassesPrimary?: string;
  loadingClassesSecondary?: string;
  loadingClassesActiveSecondary?: string;
  loadingClassesError?: string;
  loadingClassesAlert?: string;
  iconLeftClasses?: string;
  iconRightClasses?: string;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant: 'primary' | 'secondary' | 'error' | 'alert' | 'active-secondary';
  label: string;
  loading?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  onClick: (e: MouseEvent) => Promise<void> | void;
}) {
  const classes = [classesBase, className];
  const loadingClasses = [loadingClassesBase];
  switch (variant) {
    case 'primary':
      classes.push(classesPrimary);
      loadingClasses.push(loadingClassesPrimary);
      break;
    case 'secondary':
      classes.push(classesSecondary);
      loadingClasses.push(loadingClassesSecondary);
      break;
    case 'active-secondary':
      classes.push(classesActiveSecondary);
      loadingClasses.push(loadingClassesActiveSecondary);
      break;
    case 'error':
      classes.push(classesError);
      loadingClasses.push(loadingClassesError);
      break;
    case 'alert':
      classes.push(classesAlert);
      loadingClasses.push(loadingClassesAlert);
      break;
  }
  return (
    <button onClick={async (e) => await onClick(e)} className={classes.join(' ')} disabled={disabled} type={type}>
      {iconLeft && <Icon className={iconLeftClasses} name={iconLeft} />}
      {label && <span>{label}</span>}
      {iconRight && <Icon className={iconRightClasses} name={iconRight} />}
      {loading && <LoadingIndicator className={loadingClasses.join(' ')} />}
    </button>
  );
}
