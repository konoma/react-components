import { useEffect, useState } from 'react';

import Input from '../form/input.tsx';
import Icon from '../ui/icon.tsx';

export interface PaginationClasses {
  activeIconClasses: string;
  inactiveIconClasses: string;
  wrapperClasses: string;
  resultsClasses: string;
  resultsTextClasses: string;
  controlClasses: string;
}

const baseClasses: PaginationClasses = {
  activeIconClasses: 'w-8 p-2 cursor-pointer rounded-full bg-white',
  inactiveIconClasses: 'w-8 p-2 cursor-not-allowed text-secondary-500',
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
  currentStart,
  currentEnd,
  currentTotal,
  totalPages,
  showButtons,
  onFirstPage = () => {
    return;
  },
  onPreviousPage = () => {
    return;
  },
  onNextPage = () => {
    return;
  },
  onLastPage = () => {
    return;
  },
  toPage = (page: number) => {
    return;
  },
}: {
  currentLoaded: number;
  currentStart: number;
  currentEnd: number;
  currentTotal: number;
  currentPage: number;
  totalPages: number;
  inactiveIconClasses?: string;
  activeIconClasses?: string;
  wrapperClasses?: string;
  resultsClasses?: string;
  resultsTextClasses?: string;
  controlClasses?: string;
  xToY: string;
  showButtons: boolean;
  onFirstPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
  toPage?: (page: number) => void;
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
              name="lucide:chevron-first"
              onClick={() => (previousPageActive ? onFirstPage() : undefined)}
            />
            <Icon
              className={previousPageActive ? activeIconClasses : inactiveIconClasses}
              name="lucide:chevron-left"
              onClick={() => (previousPageActive ? onPreviousPage() : undefined)}
            />
            <div className="w-16">
              <Input
                centered
                value={pageInternal}
                onChange={(v) => setPageInternal(+v)}
                onKeyDown={(e) => onKeyDown(e as React.KeyboardEvent<HTMLInputElement>)}
              />
            </div>
            <Icon
              className={nextPageActive ? activeIconClasses : inactiveIconClasses}
              name="lucide:chevron-right"
              onClick={() => (nextPageActive ? onNextPage() : undefined)}
            />
            <Icon
              className={nextPageActive ? activeIconClasses : inactiveIconClasses}
              name="lucide:chevron-last"
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
