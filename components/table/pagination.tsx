export interface PaginationClasses {
  activeIconClasses: string;
  inactiveIconClasses: string;
  wrapperClasses: string;
  resultsClasses: string;
  resultsTextClasses: string;
  controlClasses: string;
}

const baseClasses: PaginationClasses = {
  activeIconClasses: 'h-10 w-10 p-2 cursor-pointer rounded-full bg-white',
  inactiveIconClasses: 'h-10 w-10 p-2 cursor-not-allowed text-secondary-500',
  wrapperClasses: 'flex flex-row justify-between p-4',
  resultsClasses: 'flex flex-row gap-1 text-sm',
  resultsTextClasses: 'font-medium',
  controlClasses: 'flex flex-row items-center gap-4 py-2',
};

export default function Pagination({
  wrapperClasses = baseClasses.wrapperClasses,
  resultsClasses = baseClasses.resultsClasses,
  resultsTextClasses = baseClasses.resultsTextClasses,
  xToY,
}: {
  currentLoaded: number;
  currentTotal: number;
  wrapperClasses?: string;
  resultsClasses?: string;
  resultsTextClasses?: string;
  xToY?: string;
}) {
  return (
    <div className={wrapperClasses}>
      <div className={resultsClasses}>
        <span className={resultsTextClasses}>{xToY}</span>
      </div>
    </div>
  );
}
