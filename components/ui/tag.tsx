import { Icon, type IconifyIcon } from '@iconify-icon/react';

const baseClasses = {
  wrapperClasses:
    'flex flex-row h-6 cursor-pointer items-center justify-center gap-1 rounded-xl border border-secondary-300 px-3 py-1 bg-primary-100 text-secondary-900',
  titleClasses: 'text-center text-xs font-medium',
  iconLeftClasses: 'h-4 w-4',
  iconRightClasses: 'h-4 w-4',
};

export default function Tag({
  wrapperClasses = baseClasses.wrapperClasses,
  titleClasses = baseClasses.titleClasses,
  iconLeftClasses = baseClasses.iconLeftClasses,
  iconRightClasses = baseClasses.iconRightClasses,
  iconLeft,
  iconRight,
  title,
  onClick = () => {
    return;
  },
  onClickIconLeft = () => {
    return;
  },
  onClickIconRight = () => {
    return;
  },
}: {
  wrapperClasses?: string;
  titleClasses?: string;
  iconLeftClasses?: string;
  iconRightClasses?: string;
  iconLeft?: IconifyIcon | string;
  iconRight?: IconifyIcon | string;
  title: string;
  onClick?: () => void;
  onClickIconLeft?: () => void;
  onClickIconRight?: () => void;
}) {
  return (
    <div className={wrapperClasses} onClick={onClick}>
      {iconLeft && <Icon icon={iconLeft} className={iconLeftClasses} onClick={onClickIconLeft} />}
      <div className={titleClasses}>{title}</div>
      {iconRight && <Icon icon={iconRight} className={iconRightClasses} onClick={onClickIconRight} />}
    </div>
  );
}
