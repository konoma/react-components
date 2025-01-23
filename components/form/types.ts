import type { IconifyIcon } from '@iconify-icon/react';
import type { ChangeEvent, HTMLInputTypeAttribute, JSX, MouseEvent } from 'react';

type LabelPosition = 'top' | 'bottom' | 'left' | 'right';

export type FormValue = string | number | boolean | Option;

export interface Option {
  value: FormValue;
  label: string | number;
}

/** Classes for the form components. Not all classes have effects in all components. Properties that start with 'class-' apply to the component in general, other properties apply to specific parts of the component */
export interface Classes {
  /** Never has a default value and can be used to assign arbitrary additional classes. The exact node that receives these classes differs from component to component */
  className?: string;
  /** Base classes, usually assigned to the control */
  classes?: string;
  /** Base classes, assigned directly to the control. Might be needed in case of more complex nesting */
  controlClasses?: string;
  /** Used for components that have specific styling when in neutral state */
  classesNeutral?: string;
  /** Used for components that have specific styling when empty */
  classesEmpty?: string;
  classesDisabled?: string;
  /** Used for components that have specific styling when in error */
  classesError?: string;
  /** Used for components that have specific styling when filled */
  classesFilled?: string;
  /** Used for the label in components that have specific styling when empty */
  labelClassesEmpty?: string;
  /** Used for the label in components that have specific styling when in error */
  labelClassesError?: string;
  /** Used for the label in components that have specific styling when filled */
  labelClassesFilled?: string;
  /** General classes for the label */
  labelClasses?: string;
  /** Needed in case of nested label */
  labelWrapperClasses?: string;
  /** Used for the icon in components that have specific styling when filled */
  iconClassesFilled?: string;
  /** General classes for the wrapper */
  wrapperClasses?: string;
  /** General classes for the icon on the left */
  iconLeftClasses?: string;
  /** General classes for the icon on the right */
  iconRightClasses?: string;
  /** General classes for the error message */
  errorClasses?: string;
  /** Additional classes for the control when an icon is present on the left */
  additionalClassesIconLeft?: string;
  /** Additional classes for the control when an icon is present on the right */
  additionalClassesIconRight?: string;
  /** General classes for hints placed within the component */
  hintClasses?: string;
  /** General classes for the resize element */
  resizeClasses?: string;
  /** General classes for the icon within the resize element */
  resizeIconClasses?: string;
  /** Classes to be applied to all values for components with multiple possible values */
  optionClasses?: string;
  /** Classes to be applied to the wrapper for elements on the left side */
  wrapperLeftClasses?: string;
  /** Classes to be applied to the wrapper for elements on the right side */
  wrapperRightClasses?: string;
  // Properties for classes specific to the select component since it is effectively an Omnibox that is more complex than the other form components
  focusClasses?: string;
  optionFocusedClasses?: string;
  optionSelectedClasses?: string;
  valueClasses?: string;
  placeholderClasses?: string;
  indicatorClasses?: string;
  valueContainerClasses?: string;
}

export interface FormFieldProps<DataType> extends Classes {
  allowCustomValues?: boolean;
  customValueLabel?: string;
  arrangement?: 'horizontal' | 'vertical';
  centered?: boolean;
  autoFocus?: boolean;
  childClasses?: { [key in keyof Classes]?: string };
  defaultValue?: FormValue;
  disabled?: boolean;
  error?: string[];
  forgotPWText?: string;
  iconLeft?: IconifyIcon | string;
  iconRight?: IconifyIcon | string;
  indeterminate?: boolean;
  isClearable?: boolean;
  replacements?: Record<string, string>;
  label?: string | JSX.Element;
  labelPosition?: LabelPosition;
  maxLength?: number;
  maxLengthLabel?: string;
  name?: keyof DataType;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  resizeIcon?: IconifyIcon | string;
  addTagTitle?: string;
  searchable?: boolean;
  textRight?: string;
  type?: HTMLInputTypeAttribute;
  initialHeight?: number;
  mask?: Mask | Mask[];
  min?: number;
  max?: number;
  /** Used for components that bind to one value */
  value?: FormValue;
  /** Used for components that bind to multiple values */
  values?: FormValue[];
  /** Used for selects that have no visible selected value */
  noValue?: boolean;
  isMulti?: boolean;
  valueTransformer?: (value: FormValue) => FormValue;
  /** Used to place the dropdown element of a Select */
  menuPortalTarget?: HTMLElement;
  forgotPWAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onChange?: (value: FormValue | FormValue[], event?: ChangeEvent) => void;
  onInput?: (value: FormValue, event?: InputEvent) => void;
  onClick?: (e: MouseEvent) => void;
  onIconRightClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export const positionClasses: Record<LabelPosition, string> = {
  top: 'flex-col',
  bottom: 'flex-col-reverse',
  left: 'flex-row',
  right: 'flex-row-reverse',
};

export type Mask = string | RegExp | { mask: Mask; definitions?: Record<string, RegExp> };
