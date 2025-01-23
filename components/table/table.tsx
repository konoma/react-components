import type { JSX } from 'react';
import { useMemo, useRef } from 'react';

import type { ColumnClasses } from './column';
import { FilterContext } from './FilterContext';
import type { PaginationClasses } from './pagination';
import Pagination from './pagination';

export interface TableColumn<DataType> {
  id: keyof DataType;
  title: string | JSX.Element;
  initialWidth?: string | number;
  hidden?: boolean;
  sorting?: '+' | '-' | undefined;
  // Mutually exclusive with onClick
  sortKey?: string;
  filterKey?: string;
  // Mutually exclusive with sorting
  onClick?: () => void;
  allowResize?: boolean;
  filterable?: boolean;
  grow?: boolean;
}

const baseClasses = {
  wrapperClasses: 'flex flex-col rounded-2xl border',
  columnsWrapperClasses: 'flex flex-row overflow-x-auto overflow-y-auto h-full',
  columnsLeftClasses: 'flex flex-row h-fit overflow-x-auto border-r first:rounded-tl-2xl last:rounded-tr-2xl',
  columnsCenterClasses: 'flex grow flex-row h-fit overflow-x-auto first:rounded-tl-2xl last:rounded-tr-2xl',
  columnsRightClasses: 'flex flex-row h-fit overflow-x-auto border-l first:rounded-tl-2xl last:rounded-tr-2xl',
  noDataClasses: 'flex h-16 items-center justify-start pl-16 rounded-b-2xl bg-white text-secondary-500 w-full',
};

export default function Table<DataType>({
  noDataClasses = baseClasses.noDataClasses,
  paginationClasses,
  columnsCenter,
  columnsRight,
  columnsLeft,
  cellRenderer,
  filters = {},
  data,
  pagination,
  totalRows,
  noEntryLabel,
  onRowClick = () => {
    return;
  },
  onRowDoubleClick = () => {
    return;
  },
  onScroll = () => {
    return;
  },
  onUpdateFilters = async () => {
    return;
  },
}: {
  wrapperClasses?: string;
  columnsWrapperClasses?: string;
  columnsLeftClasses?: string;
  columnsCenterClasses?: string;
  columnsRightClasses?: string;
  noDataClasses?: string;
  paginationClasses?: PaginationClasses;
  columnClasses?: ColumnClasses;
  columnsCenter: TableColumn<DataType>[];
  columnsRight?: TableColumn<DataType>[];
  columnsLeft?: TableColumn<DataType>[];
  cellRenderer?: { [key in keyof DataType]?: (data: DataType) => JSX.Element };
  filterComponent?: { [key in keyof DataType]?: (data: DataType) => JSX.Element };
  filters?: Record<string, string>;
  showFilters?: boolean;
  data: DataType[];
  pagination?: boolean;
  totalRows: number;
  noEntryLabel?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onFirstPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
  toPage?: (page: number) => void;
  onRowClick?: (data: DataType) => void;
  onRowDoubleClick?: (data: DataType) => void;
  onSort?: (column: TableColumn<DataType>) => void;
  onUpdateFilters?: (filters: Record<string, string>) => Promise<void>;
  onUpdateColumnsLeft?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
  onUpdateColumnsCenter?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
  onUpdateColumnsRight?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
}) {
  // const hasFilters = !!(
  //   showFilters &&
  //   (columnsCenter.some((column) => column.filterable) ||
  //     columnsLeft?.some((column) => column.filterable) ||
  //     columnsRight?.some((column) => column.filterable))
  // );

  const header = useRef<HTMLDivElement>(null);

  const currentColumnsLeft = useMemo(() => columnsLeft?.filter((column) => !column?.hidden) || [], [columnsLeft]);
  const currentColumnsCenter = useMemo(() => columnsCenter?.filter((column) => !column?.hidden) || [], [columnsCenter]);
  const currentColumnsRight = useMemo(() => columnsRight?.filter((column) => !column?.hidden) || [], [columnsRight]);

  async function updateFilters(newFilters: Record<string, string>) {
    await onUpdateFilters(newFilters);
  }
  return (
    <div className="relative h-full">
      <div
        style={{
          gridTemplateRows: `repeat(${data.length + 1}, auto)`,
          display: 'grid',
          gridAutoFlow: 'row',
          gridAutoRows: 'auto',
        }}
        className="max-h-full max-w-full overflow-x-auto overflow-y-auto rounded-2xl"
        onScroll={onScroll}
      >
        <FilterContext.Provider value={{ filters, setFilters: updateFilters }}>
          {/* Header */}
          <div ref={header} className="sticky top-0 z-[1] flex flex-row items-center justify-between rounded-t-2xl bg-secondary-100">
            {!!currentColumnsLeft.length && (
              <div className="sticky left-0 flex flex-row">
                {currentColumnsLeft.map((column) => (
                  <div
                    key={column.id.toString()}
                    style={{
                      minWidth: column.initialWidth,
                      maxWidth: column.initialWidth,
                    }}
                    className="flex h-12 flex-row items-center truncate bg-secondary-100 px-4 py-3 text-xs font-medium first:rounded-tl-2xl"
                  >
                    {column.title}
                  </div>
                ))}
              </div>
            )}
            {currentColumnsCenter.map((column) => (
              <div
                key={column.id.toString()}
                style={{
                  minWidth: column.initialWidth,
                  maxWidth: column.initialWidth,
                }}
                className="flex h-12 flex-row items-center truncate bg-secondary-100 px-4 py-3 text-xs font-medium first:rounded-tl-2xl last:rounded-tr-2xl"
              >
                {column.title}
              </div>
            ))}
            {!!currentColumnsRight.length && (
              <div className="sticky right-0 flex flex-row">
                {currentColumnsRight.map((column) => (
                  <div
                    key={column.id.toString()}
                    style={{
                      minWidth: column.initialWidth,
                      maxWidth: column.initialWidth,
                    }}
                    className="flex h-12 flex-row items-center justify-end truncate bg-secondary-100 px-4 py-3 text-xs font-medium last:rounded-tr-2xl"
                  >
                    {column.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Body */}
          {data.map((entry, i) => {
            return (
              <div
                key={i}
                className={`group relative flex flex-row justify-between rounded-t-2xl bg-white last:rounded-b-2xl hover:bg-primary-100`}
                onClick={() => onRowClick(entry)}
                onDoubleClick={() => onRowDoubleClick(entry)}
              >
                {!!currentColumnsLeft.length && (
                  <div className="sticky left-0 flex flex-row border-r">
                    {currentColumnsLeft.map((column) => {
                      return (
                        <div
                          key={column.id.toString()}
                          style={{
                            minWidth: column.initialWidth,
                            maxWidth: column.initialWidth,
                          }}
                          className="bg-white group-hover:bg-primary-100"
                          title={(entry[column.id] as string) || ''}
                        >
                          {cellRenderer?.[column.id]?.(entry) || (
                            <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {currentColumnsCenter.map((column) => {
                  return (
                    <div
                      key={column.id.toString()}
                      style={{
                        minWidth: column.initialWidth,
                        maxWidth: column.initialWidth,
                      }}
                      className="bg-white first:grow group-hover:bg-primary-100"
                      title={entry[column.id] ? (entry[column.id] as string).toString() : ''}
                    >
                      {cellRenderer?.[column.id]?.(entry) || (
                        <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                      )}
                    </div>
                  );
                })}
                {!!currentColumnsRight.length && (
                  <div className="sticky right-0 flex flex-row border-l">
                    {currentColumnsRight.map((column) => {
                      return (
                        <div
                          key={column.id.toString()}
                          style={{
                            minWidth: column.initialWidth,
                            maxWidth: column.initialWidth,
                          }}
                          className="bg-white group-hover:bg-primary-100"
                          title={(entry[column.id] as string) || ''}
                        >
                          {cellRenderer?.[column.id]?.(entry) || (
                            <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div
                  style={{ width: `${(header.current?.scrollWidth || 0) - 1}px` }}
                  className="absolute bottom-0 left-0 right-0 h-px bg-secondary-100"
                ></div>
              </div>
            );
          })}
        </FilterContext.Provider>
        {data.length === 0 && <div className={noDataClasses}>{noEntryLabel}</div>}
      </div>
      {pagination && data.length > 0 && <Pagination currentTotal={totalRows} currentLoaded={data.length} {...paginationClasses} />}
    </div>
  );
}
