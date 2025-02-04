import { createPortal } from 'react-dom';

import Button from './button';
import Icon from './icon';

export default function Modal({
  backdropClasses = 'fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50',
  contentClasses = 'rounded-krc-modal bg-white shadow-lg flex flex-col',
  headerWrapperClasses = 'w-full h-16 px-6 bg-primary-900 rounded-t justify-start items-center flex',
  footerWrapperClasses = 'w-full pb-4 px-6 bg-white rounded-b justify-between items-center flex flex-row',
  footerLeftClasses = 'flex flex-row gap-4 justify-start',
  footerRightClasses = 'grow flex flex-row gap-4 justify-end',
  titleClasses = 'text-white text-base font-semibold',
  closeWrapperClasses = 'flex justify-between border-b border-secondary-200 p-4',
  iconClasses = 'h-5 w-5 cursor-pointer',
  children,
  headerContent,
  footerContent,
  title,
  footerActions,
  hasCloseIcon,
  onClose,
}: {
  backdropClasses?: string;
  contentClasses?: string;
  headerWrapperClasses?: string;
  footerWrapperClasses?: string;
  footerLeftClasses?: string;
  footerRightClasses?: string;
  titleClasses?: string;
  closeWrapperClasses?: string;
  iconClasses?: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  title?: string;
  footerActions?: (React.ComponentProps<typeof Button> & {
    position: 'left' | 'right';
  })[];
  hasCloseIcon?: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {createPortal(
        <div className={backdropClasses} onMouseDown={onClose} role="presentation">
          <div
            role="presentation"
            className={contentClasses}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            {/* TODO: Handle close and header simultaneously */}
            {hasCloseIcon && (
              <div className={closeWrapperClasses}>
                <button onClick={onClose}>
                  <Icon name="heroicons:x-mark-16-solid" className={iconClasses} />
                </button>
              </div>
            )}
            {headerContent ||
              (title ? (
                <div className={headerWrapperClasses}>
                  <span className={titleClasses}>{title}</span>
                </div>
              ) : null)}
            <div className="grow">{children}</div>
            {footerContent ||
              (footerActions && (
                <>
                  <div className={footerWrapperClasses}>
                    <div className={footerLeftClasses}>
                      {footerActions
                        .filter(({ position }) => position === 'left')
                        .map(({ label, variant, onClick }, i) => (
                          <div key={i}>
                            <Button variant={variant ?? 'primary'} onClick={onClick} label={label} />
                          </div>
                        ))}
                    </div>
                    <div className={footerRightClasses}>
                      {footerActions
                        .filter(({ position }) => position === 'right')
                        .map(({ variant, ...buttonProps }, i) => (
                          <div key={i}>
                            <Button variant={variant ?? 'secondary'} {...buttonProps} />
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
