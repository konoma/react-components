import type { IconifyIconHTMLElement } from '@iconify-icon/react';
import type { HTMLProps, SVGProps } from 'react';
import { Icon as IconifyIcon } from '@iconify-icon/react';

export default function Icon({
  path,
  name,
  dataTestId,
  ...props
}: (HTMLProps<HTMLElement> | SVGProps<SVGSVGElement>) & {
  // use this for icons included in iconify
  name?: string
  // use this for custom icons
  path?: string
  dataTestId?: string
}) {
  if (process.env.NEXT_PUBLIC_PREVENT_EXTERNAL_RESOURCES === 'true' && !path && name) {
    throw new Error('External resources are disabled, cannot use iconify icons');
  }
  return path
    ? (
        <svg {...(props as SVGProps<SVGSVGElement>)} data-testid={dataTestId}>
          <use href={path} />
        </svg>
      )
    : name
      ? (
          <IconifyIcon data-testid={dataTestId} icon={name} height="none" width="none" {...(props as HTMLProps<IconifyIconHTMLElement>)} />
        )
      : (
          <></>
        );
}
