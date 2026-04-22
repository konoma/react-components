import { useEffect, useState } from 'react';

import Input from '../form/input.tsx';
import Icon from '../ui/icon.tsx';

export interface PaginationClasses {
  activeIconClasses: string
  inactiveIconClasses: string
  wrapperClasses: string
  resultsClasses: string
  resultsTextClasses: string
  controlClasses: string
}

const baseClasses: PaginationClasses = {
  activeIconClasses: 'w-8 h-8 p-1 cursor-pointer rounded-full bg-white',
  inactiveIconClasses: 'w-8 h-8 p-1 cursor-not-allowed text-secondary-500',
  wrapperClasses: 'flex flex-row justify-between p-4',
  resultsClasses: 'flex flex-row gap-1 text-sm',
  resultsTextClasses: 'font-medium',
  controlClasses: 'flex flex-row items-center gap-4 pb-2',
};

export default function Pagination({
  wrapperClasses = baseClasses.wrapperClasses,
  resultsClasses = baseClasses.resultsClasses,
  resultsTextClasses = baseClasses.resultsTextClasses,
  activeIconClasses = baseClasses.activeIconClasses,
  inactiveIconClasses = baseClasses.inactiveIconClasses,
  controlClasses = baseClasses.controlClasses,
  xToY,
  currentPage,
  totalPages,
  showButtons,
  dataTestId,
  firstPageIconName,
  firstPageIconPath,
  previousPageIconName,
  previousPageIconPath,
  nextPageIconName,
  nextPageIconPath,
  lastPageIconName,
  lastPageIconPath,
  onFirstPage = () => {

  },
  onPreviousPage = () => {

  },
  onNextPage = () => {

  },
  onLastPage = () => {

  },
  toPage = () => {

  },
}: {
  currentLoaded: number
  currentStart: number
  currentEnd: number
  currentTotal: number
  currentPage: number
  totalPages: number
  inactiveIconClasses?: string
  activeIconClasses?: string
  wrapperClasses?: string
  resultsClasses?: string
  resultsTextClasses?: string
  controlClasses?: string
  xToY: string
  showButtons: boolean
  firstPageIconName?: string
  firstPageIconPath?: string
  previousPageIconName?: string
  previousPageIconPath?: string
  nextPageIconName?: string
  nextPageIconPath?: string
  lastPageIconName?: string
  lastPageIconPath?: string
  dataTestId?: string
  onFirstPage?: () => void
  onPreviousPage?: () => void
  onNextPage?: () => void
  onLastPage?: () => void
  toPage?: (page: number) => void
}) {
  const previousPageActive = currentPage !== 1;
  const nextPageActive = currentPage !== totalPages;

  const [pageInternal, setPageInternal] = useState(currentPage);

  useEffect(() => {
    setPageInternal(currentPage);
  }, [currentPage]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'Enter':
        toPage(pageInternal);
        break;
    }
  }
  if (showButtons) {
    return (
      <div className={wrapperClasses}>
        <div className={resultsClasses}>
          <span className={resultsTextClasses}>{xToY}</span>
        </div>

        {totalPages > 1 && (
          <div className={controlClasses}>
            <Icon
              className={previousPageActive ? activeIconClasses : inactiveIconClasses}
              dataTestId={dataTestId ? `${dataTestId}-first-page` : undefined}
              name={firstPageIconName || 'lucide:chevron-first'}
              path={firstPageIconPath}
              onClick={() => (previousPageActive ? onFirstPage() : undefined)}
            />
            <Icon
              className={previousPageActive ? activeIconClasses : inactiveIconClasses}
              dataTestId={dataTestId ? `${dataTestId}-previous-page` : undefined}
              name={previousPageIconName || 'lucide:chevron-left'}
              path={previousPageIconPath}
              onClick={() => (previousPageActive ? onPreviousPage() : undefined)}
            />
            <div className="w-16 h-10">
              <Input
                centered
                dataTestId={dataTestId ? `${dataTestId}-page-input` : undefined}
                value={pageInternal}
                onChange={v => setPageInternal(+v)}
                onKeyDown={e => onKeyDown(e as React.KeyboardEvent<HTMLInputElement>)}
              />
            </div>
            <Icon
              className={nextPageActive ? activeIconClasses : inactiveIconClasses}
              dataTestId={dataTestId ? `${dataTestId}-next-page` : undefined}
              name={nextPageIconName || 'lucide:chevron-right'}
              path={nextPageIconPath}
              onClick={() => (nextPageActive ? onNextPage() : undefined)}
            />
            <Icon
              className={nextPageActive ? activeIconClasses : inactiveIconClasses}
              dataTestId={dataTestId ? `${dataTestId}-last-page` : undefined}
              name={lastPageIconName || 'lucide:chevron-last'}
              path={lastPageIconPath}
              onClick={() => (nextPageActive ? onLastPage() : undefined)}
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={wrapperClasses}>
      <div className={resultsClasses}>
        <span className={resultsTextClasses}>{xToY}</span>
      </div>
    </div>
  );
}
