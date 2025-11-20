import type { IconifyIconHTMLElement } from '@iconify-icon/react';
import { Icon as IconifyIcon } from '@iconify-icon/react';
import type { HTMLProps, SVGProps } from 'react';

export default function Icon({
  path,
  name,
  dataTestId,
  ...props
}: (HTMLProps<HTMLElement> | SVGProps<SVGSVGElement>) & {
  // use this for icons included in iconify
  name?: string;
  // use this for custom icons
  path?: string;
  dataTestId?: string;
}) {
  return path ? (
    <svg {...(props as SVGProps<SVGSVGElement>)} data-testid={dataTestId}>
      <use href={path} />
    </svg>
  ) : name ? (
    <IconifyIcon data-testid={dataTestId} icon={name} height="none" width="none" {...(props as HTMLProps<IconifyIconHTMLElement>)} />
  ) : (
    <></>
  );
}
