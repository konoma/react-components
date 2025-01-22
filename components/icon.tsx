import * as outline from '@heroicons/react/24/outline';
import * as solid from '@heroicons/react/24/solid';
import { type SVGProps } from 'react';

export type HeroIconName = keyof typeof outline;

export function Icon({
  name,
  className,
  type = 'outline',
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName | HeroIconName;
  type?: 'outline' | 'solid';
}) {
  if (!name) {
    return null;
  }

  if (!customIcons.includes(name as (typeof customIcons)[number])) {
    let HeroIcon;
    if (type === 'outline') {
      HeroIcon = outline[name as HeroIconName];
    } else {
      HeroIcon = solid[name as HeroIconName];
    }
    return <HeroIcon className={className} {...props} />;
  } else {
    return (
      <svg {...props} className={className}>
        <use href={`/icons/sprite.svg#${name}`} />
      </svg>
    );
  }
}

export const customIcons = [] as const;

export type IconName = (typeof customIcons)[number] | HeroIconName;
