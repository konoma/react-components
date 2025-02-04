import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useState } from 'react';

import Icon from '../ui/icon';

export default function TableActions({ children, classes = 'h-14 p-4' }: { children: React.ReactNode; classes?: string }) {
  const [actionsVisible, setActionsVisible] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: actionsVisible,
    onOpenChange: setActionsVisible,
    middleware: [flip(), shift()],
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  return (
    <div className={classes}>
      <div ref={refs.setReference} {...getReferenceProps()} className="cursor-pointer">
        <div>
          <Icon name="heroicons:ellipsis-vertical-16-solid" className="h-5 w-5" />
        </div>
      </div>
      {actionsVisible && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className="flex w-48 flex-col rounded-md border border-secondary-200 bg-white py-2 text-sm font-medium shadow"
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}

type TableActionVariant = 'error' | 'success' | 'warning' | 'default';
export function TableActionEntry({
  text,
  variant = 'default',
  onClick,
}: {
  text: string;
  variant?: TableActionVariant;
  onClick: () => void;
}) {
  switch (variant) {
    case 'error':
      return (
        <span onClick={onClick} className="cursor-pointer px-4 py-2 text-error-900 hover:bg-error-100">
          {text}
        </span>
      );
    default:
      return (
        <span onClick={onClick} className="cursor-pointer px-4 py-2 text-secondary-900 hover:bg-primary-100">
          {text}
        </span>
      );
  }
}
