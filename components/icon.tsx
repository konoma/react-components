// TODO: Currently this always loads all heroicons. For performance reasons it would be prefarable to only load them when they are used. But this interferes with the approach to have a single icon component that can handle both custom and heroicons as well as strict type checking for the icons. This should be revisited in the future.

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

// TODO: How can this be filled with the actual custom icons while preserving typing?
export const customIcons = [] as const;

export type IconName = (typeof customIcons)[number] | HeroIconName;
