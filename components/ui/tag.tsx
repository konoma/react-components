import Icon from './icon';

const baseClasses = {
  wrapperClasses:
    'flex flex-row h-6 cursor-pointer items-center justify-center gap-1 rounded-krc-tag border border-secondary-300 px-3 py-1 bg-primary-100 text-secondary-900',
  titleClasses: 'text-center text-xs font-medium',
  iconLeftClasses: 'h-4 w-4',
  iconRightClasses: 'h-4 w-4',
};

export default function Tag({
  wrapperClasses = baseClasses.wrapperClasses,
  titleClasses = baseClasses.titleClasses,
  iconLeftClasses = baseClasses.iconLeftClasses,
  iconRightClasses = baseClasses.iconRightClasses,
  iconLeftPath,
  iconLeftName,
  iconRightPath,
  iconRightName,
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
  iconLeftPath?: string;
  iconLeftName?: string;
  iconRightPath?: string;
  iconRightName?: string;
  title: string;
  onClick?: () => void;
  onClickIconLeft?: () => void;
  onClickIconRight?: () => void;
}) {
  return (
    <div className={wrapperClasses} onClick={onClick}>
      {(iconLeftPath || iconLeftName) && (
        <Icon name={iconLeftName} path={iconLeftPath} className={iconLeftClasses} onClick={onClickIconLeft} />
      )}
      <div className={titleClasses}>{title}</div>
      {(iconRightPath || iconRightName) && (
        <Icon name={iconRightName} path={iconRightPath} className={iconRightClasses} onClick={onClickIconRight} />
      )}
    </div>
  );
}
